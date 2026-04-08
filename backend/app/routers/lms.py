import asyncio
from datetime import datetime, timezone
from bson import ObjectId
from fastapi import APIRouter, Depends, Header, HTTPException, Request
from app.core.config import settings
from app.db import mongo
from app.deps.auth import get_current_user, get_tenant_id, require_roles
from app.models.enums import Role
from app.schemas.lms import (
    CouponIn,
    CourseUpdateIn,
    CourseIn,
    EnrollmentIn,
    EventIn,
    LiveClassIn,
    LiveClassUpdateIn,
    NotificationIn,
    PlanIn,
    PlatformSettingsIn,
    LibraryResourceIn,
    ReportGenerateIn,
    RazorpayOrderIn,
    ResetPasswordIn,
    RazorpayVerifyIn,
    TenantIn,
    TenantUpdateIn,
    UserIn,
    UserUpdateIn,
)
from app.services.payments import verify_razorpay_signature, verify_webhook_signature
from app.services.email import send_transactional_email
from app.services.realtime import ws_manager
from app.services.zoom import create_zoom_meeting
from app.utils.security import hash_password

router = APIRouter(prefix="/lms", tags=["lms"])


class _DBProxy:
    def __getattr__(self, name):
        if mongo.db is None:
            raise HTTPException(status_code=500, detail="Database not initialized")
        return getattr(mongo.db, name)


db = _DBProxy()


def as_dict(doc: dict) -> dict:
    if not doc:
        return {}
    doc["_id"] = str(doc["_id"])
    return doc


def inserted_response(data: dict, inserted_id) -> dict:
    # Motor injects _id:ObjectId into inserted documents by mutation.
    return {**data, "_id": str(inserted_id)}


async def paged(collection, query: dict, sort_field: str, sort_dir: int, skip: int, limit: int):
    total = await collection.count_documents(query)
    items = [as_dict(x) async for x in collection.find(query).sort(sort_field, sort_dir).skip(skip).limit(limit)]
    return {"items": items, "total": total, "skip": skip, "limit": limit}


async def _tenant_user_ids(tenant_id: str, roles: list[str] | None = None, exclude_ids: set[str] | None = None) -> list[str]:
    query = {"tenant_id": tenant_id}
    if roles:
        query["role"] = {"$in": roles}
    users = [x async for x in db.users.find(query, {"_id": 1})]
    ids = [str(x.get("_id")) for x in users if x.get("_id")]
    if exclude_ids:
        ids = [uid for uid in ids if uid not in exclude_ids]
    return ids


async def _create_user_notifications(
    *,
    tenant_id: str,
    user_ids: list[str],
    title: str,
    message: str,
    meta: dict | None = None,
):
    unique_user_ids = [uid for uid in dict.fromkeys([str(x) for x in user_ids if x])]
    if not unique_user_ids:
        return

    now = datetime.now(timezone.utc)
    docs = [
        {
            "tenant_id": tenant_id,
            "user_id": uid,
            "title": title,
            "message": message,
            "meta": meta or {},
            "read": False,
            "created_at": now,
            "updated_at": now,
        }
        for uid in unique_user_ids
    ]
    await db.notifications.insert_many(docs)

    await ws_manager.broadcast(
        f"tenant:{tenant_id}",
        {"type": "notification.created", "data": {"title": title, "message": message, "meta": meta or {}}},
    )
    for uid in unique_user_ids:
        await ws_manager.broadcast(
            f"user:{uid}",
            {"type": "notification.created", "data": {"title": title, "message": message, "meta": meta or {}}},
        )

    object_ids = [ObjectId(uid) for uid in unique_user_ids if ObjectId.is_valid(uid)]
    if not object_ids:
        return
    recipients = [
        x
        async for x in db.users.find(
            {"tenant_id": tenant_id, "_id": {"$in": object_ids}},
            {"email": 1, "full_name": 1},
        )
    ]
    tasks = []
    subject = f"{settings.app_name}: {title}"
    for rec in recipients:
        email = str(rec.get("email") or "").strip()
        if not email:
            continue
        tasks.append(send_transactional_email(email, subject, message))
    if tasks:
        await asyncio.gather(*tasks, return_exceptions=True)


@router.post("/tenants")
async def create_tenant(payload: TenantIn, _=Depends(require_roles(Role.SUPER_ADMIN))):
    now = datetime.now(timezone.utc)
    data = payload.model_dump() | {"created_at": now, "updated_at": now, "active": True}
    if mongo.db is None:
        raise HTTPException(status_code=500, detail="Database not initialized")
    res = await mongo.db.tenants.insert_one(data)
    return inserted_response(data, res.inserted_id)


@router.get("/tenants")
async def list_tenants(
    skip: int = 0,
    limit: int = 50,
    q: str | None = None,
    _=Depends(require_roles(Role.SUPER_ADMIN)),
):
    query = {}
    if q:
        query["name"] = {"$regex": q, "$options": "i"}
    return await paged(mongo.db.tenants, query, "created_at", -1, skip, limit)


@router.patch("/tenants/{tenant_id}")
async def update_tenant(tenant_id: str, payload: TenantUpdateIn, _=Depends(require_roles(Role.SUPER_ADMIN))):
    updates = {k: v for k, v in payload.model_dump().items() if v is not None}
    if not updates:
        return {"message": "No updates provided"}
    updates["updated_at"] = datetime.now(timezone.utc)
    await db.tenants.update_one({"_id": ObjectId(tenant_id)}, {"$set": updates})
    tenant = await db.tenants.find_one({"_id": ObjectId(tenant_id)})
    if not tenant:
        raise HTTPException(status_code=404, detail="Tenant not found")
    return as_dict(tenant)


@router.post("/users")
async def create_user(
    payload: UserIn,
    tenant_id: str = Depends(get_tenant_id),
    _=Depends(require_roles(Role.SUPER_ADMIN, Role.ADMIN, Role.SUB_ADMIN)),
):
    now = datetime.now(timezone.utc)
    data = payload.model_dump()
    data["password_hash"] = hash_password(data.pop("password"))
    data["tenant_id"] = tenant_id
    data["is_active"] = True
    data["created_at"] = now
    data["updated_at"] = now
    res = await db.users.insert_one(data)
    data["_id"] = str(res.inserted_id)
    data.pop("password_hash", None)
    return data


@router.get("/users")
async def list_users(
    role: str | None = None,
    skip: int = 0,
    limit: int = 100,
    q: str | None = None,
    tenant_id: str = Depends(get_tenant_id),
    _=Depends(require_roles(Role.SUPER_ADMIN, Role.ADMIN, Role.SUB_ADMIN)),
):
    query = {"tenant_id": tenant_id} if tenant_id else {}
    if role:
        query["role"] = role
    if q:
        query["$or"] = [{"full_name": {"$regex": q, "$options": "i"}}, {"email": {"$regex": q, "$options": "i"}}]
    total = await db.users.count_documents(query)
    users = []
    async for user in db.users.find(query).sort("created_at", -1).skip(skip).limit(limit):
        user["_id"] = str(user["_id"])
        user.pop("password_hash", None)
        users.append(user)
    return {"items": users, "total": total, "skip": skip, "limit": limit}


@router.patch("/users/{user_id}")
async def update_user(
    user_id: str,
    payload: UserUpdateIn,
    tenant_id: str = Depends(get_tenant_id),
    _=Depends(require_roles(Role.SUPER_ADMIN, Role.ADMIN, Role.SUB_ADMIN)),
):
    updates = {k: v for k, v in payload.model_dump().items() if v is not None}
    if not updates:
        return {"message": "No updates provided"}
    updates["updated_at"] = datetime.now(timezone.utc)
    query = {"_id": ObjectId(user_id)}
    if tenant_id:
        query["tenant_id"] = tenant_id
    await db.users.update_one(query, {"$set": updates})
    user = await db.users.find_one(query)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    user = as_dict(user)
    user.pop("password_hash", None)
    return user


@router.delete("/users/{user_id}")
async def delete_user(
    user_id: str,
    tenant_id: str = Depends(get_tenant_id),
    _=Depends(require_roles(Role.SUPER_ADMIN, Role.ADMIN, Role.SUB_ADMIN)),
):
    query = {"_id": ObjectId(user_id)}
    if tenant_id:
        query["tenant_id"] = tenant_id
    result = await db.users.delete_one(query)
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="User not found")
    return {"message": "User deleted"}


@router.patch("/users/{user_id}/reset-password")
async def reset_password(
    user_id: str,
    payload: ResetPasswordIn,
    tenant_id: str = Depends(get_tenant_id),
    _=Depends(require_roles(Role.SUPER_ADMIN, Role.ADMIN, Role.SUB_ADMIN)),
):
    query = {"_id": ObjectId(user_id)}
    if tenant_id:
        query["tenant_id"] = tenant_id
    result = await db.users.update_one(
        query,
        {"$set": {"password_hash": hash_password(payload.new_password), "updated_at": datetime.now(timezone.utc)}},
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="User not found")
    return {"message": "Password reset successful"}


@router.post("/courses")
async def create_course(payload: CourseIn, tenant_id: str = Depends(get_tenant_id), user=Depends(get_current_user)):
    now = datetime.now(timezone.utc)
    data = payload.model_dump() | {
        "tenant_id": tenant_id,
        "created_by": user.get("sub"),
        "created_at": now,
        "updated_at": now,
    }
    res = await db.courses.insert_one(data)
    await ws_manager.broadcast(f"tenant:{tenant_id}", {"type": "course.created", "data": {"title": data["title"]}})
    recipient_ids = await _tenant_user_ids(tenant_id, exclude_ids={str(user.get("sub") or "")})
    await _create_user_notifications(
        tenant_id=tenant_id,
        user_ids=recipient_ids,
        title="New course published",
        message=f"{data['title']} is now available in your LMS.",
        meta={"course_title": data["title"]},
    )
    return inserted_response(data, res.inserted_id)


@router.get("/courses")
async def list_courses(
    tenant_id: str = Depends(get_tenant_id),
    skip: int = 0,
    limit: int = 100,
    q: str | None = None,
):
    query = {"tenant_id": tenant_id} if tenant_id else {}
    if q:
        query["title"] = {"$regex": q, "$options": "i"}
    return await paged(db.courses, query, "created_at", -1, skip, limit)


@router.patch("/courses/{course_id}")
async def update_course(
    course_id: str,
    payload: CourseUpdateIn,
    tenant_id: str = Depends(get_tenant_id),
    _=Depends(require_roles(Role.SUPER_ADMIN, Role.ADMIN, Role.INSTRUCTOR)),
):
    updates = {k: v for k, v in payload.model_dump().items() if v is not None}
    if not updates:
        return {"message": "No updates provided"}
    updates["updated_at"] = datetime.now(timezone.utc)
    result = await db.courses.update_one({"_id": ObjectId(course_id), "tenant_id": tenant_id}, {"$set": updates})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Course not found")
    updated = await db.courses.find_one({"_id": ObjectId(course_id)})
    return as_dict(updated)


@router.delete("/courses/{course_id}")
async def delete_course(
    course_id: str,
    tenant_id: str = Depends(get_tenant_id),
    _=Depends(require_roles(Role.SUPER_ADMIN, Role.ADMIN, Role.INSTRUCTOR)),
):
    result = await db.courses.delete_one({"_id": ObjectId(course_id), "tenant_id": tenant_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Course not found")
    return {"message": "Course deleted"}


@router.post("/live-classes")
async def create_live_class(
    payload: LiveClassIn,
    tenant_id: str = Depends(get_tenant_id),
    user=Depends(get_current_user),
    _=Depends(require_roles(Role.SUPER_ADMIN, Role.ADMIN, Role.INSTRUCTOR)),
):
    now = datetime.now(timezone.utc)
    zoom_error = None
    try:
        zoom_data = await create_zoom_meeting(
            title=payload.title,
            start_at=payload.start_at,
            duration_minutes=payload.duration_minutes,
        )
    except HTTPException as exc:
        zoom_error = str(exc.detail)
        zoom_data = {
            "provider": "manual",
            "meeting_id": "",
            "join_url": "",
            "start_url": "",
        }
    except Exception as exc:  # noqa: BLE001
        zoom_error = f"Unexpected Zoom error: {exc}"
        zoom_data = {
            "provider": "manual",
            "meeting_id": "",
            "join_url": "",
            "start_url": "",
        }

    data = payload.model_dump() | {
        "tenant_id": tenant_id,
        "status": "upcoming",
        "created_at": now,
        "updated_at": now,
        "created_by": user.get("sub"),
        "meeting_provider": zoom_data.get("provider", "manual"),
        "meeting_id": zoom_data.get("meeting_id", ""),
        "join_url": zoom_data.get("join_url", ""),
        "start_url": zoom_data.get("start_url", ""),
        "zoom_error": zoom_error,
    }
    res = await db.live_classes.insert_one(data)
    class_id = str(res.inserted_id)
    recipients = {payload.instructor_id, *payload.attendee_ids} if payload.instructor_id else set(payload.attendee_ids)
    recipients = {rid for rid in recipients if rid and rid != user.get("sub")}
    if recipients:
        await _create_user_notifications(
            tenant_id=tenant_id,
            user_ids=list(recipients),
            title="New live class scheduled",
            message=f"{payload.title} at {payload.start_at.isoformat()}",
            meta={"live_class_id": class_id, "course_id": payload.course_id, "join_url": data.get("join_url", "")},
        )
    await ws_manager.broadcast(f"tenant:{tenant_id}", {"type": "live_class.created", "data": {"title": data["title"]}})
    response = inserted_response(data, res.inserted_id)
    if zoom_error:
        response["message"] = "Live class created but Zoom link generation failed"
    return response


@router.get("/live-classes")
async def list_live_classes(
    tenant_id: str = Depends(get_tenant_id),
    skip: int = 0,
    limit: int = 100,
    status: str | None = None,
):
    query = {"tenant_id": tenant_id} if tenant_id else {}
    if status:
        query["status"] = status
    return await paged(db.live_classes, query, "start_at", 1, skip, limit)


@router.patch("/live-classes/{live_class_id}")
async def update_live_class(
    live_class_id: str,
    payload: LiveClassUpdateIn,
    tenant_id: str = Depends(get_tenant_id),
    _=Depends(require_roles(Role.SUPER_ADMIN, Role.ADMIN, Role.INSTRUCTOR)),
):
    updates = {k: v for k, v in payload.model_dump().items() if v is not None}
    if not updates:
        return {"message": "No updates provided"}
    updates["updated_at"] = datetime.now(timezone.utc)
    result = await db.live_classes.update_one(
        {"_id": ObjectId(live_class_id), "tenant_id": tenant_id}, {"$set": updates}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Live class not found")
    item = await db.live_classes.find_one({"_id": ObjectId(live_class_id)})
    await ws_manager.broadcast(f"tenant:{tenant_id}", {"type": "live_class.updated", "data": {"id": live_class_id}})
    if item:
        recipients = {item.get("instructor_id"), *(item.get("attendee_ids") or [])}
        recipients = [uid for uid in recipients if uid]
        if recipients:
            await _create_user_notifications(
                tenant_id=tenant_id,
                user_ids=recipients,
                title="Live class updated",
                message=f"{item.get('title', 'Live class')} schedule/details were updated.",
                meta={"live_class_id": live_class_id, "join_url": item.get("join_url", "")},
            )
    return as_dict(item)


@router.post("/live-classes/{live_class_id}/regenerate-zoom")
async def regenerate_zoom_link(
    live_class_id: str,
    tenant_id: str = Depends(get_tenant_id),
    _=Depends(require_roles(Role.SUPER_ADMIN, Role.ADMIN, Role.INSTRUCTOR)),
):
    query = {"_id": ObjectId(live_class_id), "tenant_id": tenant_id}
    item = await db.live_classes.find_one(query)
    if not item:
        raise HTTPException(status_code=404, detail="Live class not found")

    zoom_error = None
    try:
        zoom_data = await create_zoom_meeting(
            title=item.get("title", "Live Class"),
            start_at=item["start_at"],
            duration_minutes=item.get("duration_minutes", 60),
        )
    except HTTPException as exc:
        zoom_error = str(exc.detail)
        zoom_data = {
            "provider": "manual",
            "meeting_id": "",
            "join_url": "",
            "start_url": "",
        }
    except Exception as exc:  # noqa: BLE001
        zoom_error = f"Unexpected Zoom error: {exc}"
        zoom_data = {
            "provider": "manual",
            "meeting_id": "",
            "join_url": "",
            "start_url": "",
        }

    updates = {
        "meeting_provider": zoom_data.get("provider", "manual"),
        "meeting_id": zoom_data.get("meeting_id", ""),
        "join_url": zoom_data.get("join_url", ""),
        "start_url": zoom_data.get("start_url", ""),
        "zoom_error": zoom_error,
        "updated_at": datetime.now(timezone.utc),
    }
    await db.live_classes.update_one(query, {"$set": updates})
    updated = await db.live_classes.find_one(query)
    await ws_manager.broadcast(
        f"tenant:{tenant_id}",
        {
            "type": "live_class.updated",
            "data": {"id": live_class_id, "join_url": updates["join_url"]},
        },
    )
    response = as_dict(updated)
    if zoom_error:
        response["message"] = "Zoom link regeneration failed"
    return response


@router.delete("/live-classes/{live_class_id}")
async def cancel_live_class(
    live_class_id: str,
    tenant_id: str = Depends(get_tenant_id),
    _=Depends(require_roles(Role.SUPER_ADMIN, Role.ADMIN, Role.INSTRUCTOR)),
):
    result = await db.live_classes.update_one(
        {"_id": ObjectId(live_class_id), "tenant_id": tenant_id},
        {"$set": {"status": "cancelled", "updated_at": datetime.now(timezone.utc)}},
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Live class not found")
    cancelled = await db.live_classes.find_one({"_id": ObjectId(live_class_id), "tenant_id": tenant_id})
    if cancelled:
        recipients = {cancelled.get("instructor_id"), *(cancelled.get("attendee_ids") or [])}
        recipients = [uid for uid in recipients if uid]
        if recipients:
            await _create_user_notifications(
                tenant_id=tenant_id,
                user_ids=recipients,
                title="Live class cancelled",
                message=f"{cancelled.get('title', 'A live class')} has been cancelled.",
                meta={"live_class_id": live_class_id},
            )
    await ws_manager.broadcast(f"tenant:{tenant_id}", {"type": "live_class.cancelled", "data": {"id": live_class_id}})
    return {"message": "Live class cancelled"}


@router.post("/enrollments")
async def create_enrollment(payload: EnrollmentIn, tenant_id: str = Depends(get_tenant_id)):
    now = datetime.now(timezone.utc)
    data = payload.model_dump() | {"tenant_id": tenant_id, "created_at": now, "updated_at": now}
    res = await db.enrollments.insert_one(data)
    await ws_manager.broadcast(f"tenant:{tenant_id}", {"type": "enrollment.created", "data": data})
    admin_ids = await _tenant_user_ids(
        tenant_id,
        roles=[Role.ADMIN.value, Role.SUB_ADMIN.value, Role.SUPER_ADMIN.value, Role.INSTRUCTOR.value],
    )
    await _create_user_notifications(
        tenant_id=tenant_id,
        user_ids=[payload.student_id, *admin_ids],
        title="Enrollment update",
        message="A new enrollment has been completed successfully.",
        meta={"course_id": payload.course_id, "student_id": payload.student_id},
    )
    return inserted_response(data, res.inserted_id)


@router.get("/enrollments")
async def list_enrollments(
    tenant_id: str = Depends(get_tenant_id),
    user=Depends(get_current_user),
    skip: int = 0,
    limit: int = 100,
):
    query = {"tenant_id": tenant_id}
    if user.get("role") == Role.STUDENT.value:
        query["student_id"] = user.get("sub")
    return await paged(db.enrollments, query, "created_at", -1, skip, limit)


@router.get("/dashboard/admin")
async def admin_dashboard(tenant_id: str = Depends(get_tenant_id), _=Depends(require_roles(Role.ADMIN, Role.SUPER_ADMIN, Role.SUB_ADMIN))):
    students = await db.users.count_documents({"tenant_id": tenant_id, "role": "student"})
    instructors = await db.users.count_documents({"tenant_id": tenant_id, "role": "instructor"})
    courses = await db.courses.count_documents({"tenant_id": tenant_id})
    revenue_pipeline = [
        {"$match": {"tenant_id": tenant_id, "status": "captured"}},
        {"$group": {"_id": None, "total": {"$sum": "$amount"}}},
    ]
    revenue_docs = [x async for x in db.payments.aggregate(revenue_pipeline)]
    revenue = revenue_docs[0]["total"] if revenue_docs else 0
    live_classes = await db.live_classes.count_documents({"tenant_id": tenant_id})
    return {
        "students": students,
        "instructors": instructors,
        "courses": courses,
        "revenue": revenue,
        "total_students": students,
        "total_instructors": instructors,
        "total_courses": courses,
        "total_live_classes": live_classes,
        "total_revenue": revenue,
    }


@router.get("/dashboard/super-admin")
async def super_admin_dashboard(_=Depends(require_roles(Role.SUPER_ADMIN))):
    total_tenants = await db.tenants.count_documents({})
    total_users = await db.users.count_documents({})
    total_courses = await db.courses.count_documents({})
    active_subscriptions = await db.tenants.count_documents({"active": True})
    expired_subscriptions = await db.tenants.count_documents({"active": False})
    revenue_docs = [
        x
        async for x in db.payments.aggregate(
            [{"$match": {"status": "captured"}}, {"$group": {"_id": None, "total": {"$sum": "$amount"}}}]
        )
    ]
    total_revenue = revenue_docs[0]["total"] if revenue_docs else 0
    revenue_by_month = [
        {"month": "Jan", "amount": 0},
        {"month": "Feb", "amount": 0},
        {"month": "Mar", "amount": 0},
        {"month": "Apr", "amount": 0},
    ]
    return {
        "total_tenants": total_tenants,
        "total_users": total_users,
        "total_courses": total_courses,
        "active_courses": total_courses,
        "active_subscriptions": active_subscriptions,
        "expired_subscriptions": expired_subscriptions,
        "revenue": total_revenue,
        "total_revenue": total_revenue,
        "revenue_by_month": revenue_by_month,
    }


@router.get("/dashboard/instructor")
async def instructor_dashboard(user=Depends(require_roles(Role.INSTRUCTOR))):
    tenant_id = user.get("tenant_id")
    instructor_id = user.get("sub")
    live_sessions = await db.live_classes.count_documents({"tenant_id": tenant_id, "instructor_id": instructor_id})
    tests_count = await db.tests.count_documents({"tenant_id": tenant_id, "instructor_id": instructor_id})
    event_count = await db.events.count_documents({"tenant_id": tenant_id})
    modules_count = await db.courses.count_documents({"tenant_id": tenant_id, "created_by": instructor_id})
    return {
        "live_sessions_week": live_sessions,
        "lab_modules": modules_count,
        "weekly_tests": tests_count,
        "events": event_count,
    }


@router.get("/dashboard/student")
async def student_dashboard(user=Depends(require_roles(Role.STUDENT))):
    tenant_id = user.get("tenant_id")
    student_id = user.get("sub")
    courses_in_progress = await db.enrollments.count_documents({"tenant_id": tenant_id, "student_id": student_id})
    live_this_week = await db.live_classes.count_documents({"tenant_id": tenant_id, "status": "upcoming"})
    certificates = await db.certificates.count_documents({"tenant_id": tenant_id, "student_id": student_id})
    notifications_unread = await db.notifications.count_documents({"user_id": student_id, "read": False})
    return {
        "courses_in_progress": courses_in_progress,
        "live_classes_week": live_this_week,
        "quiz_attempts": 0,
        "certificates_earned": certificates,
        "unread_notifications": notifications_unread,
    }


@router.post("/coupons")
async def create_coupon(
    payload: CouponIn,
    tenant_id: str = Depends(get_tenant_id),
    _=Depends(require_roles(Role.SUPER_ADMIN, Role.ADMIN, Role.INSTRUCTOR)),
):
    now = datetime.now(timezone.utc)
    data = payload.model_dump() | {"tenant_id": tenant_id, "uses": 0, "created_at": now, "updated_at": now}
    res = await db.coupons.insert_one(data)
    return inserted_response(data, res.inserted_id)


@router.get("/coupons")
async def list_coupons(
    tenant_id: str = Depends(get_tenant_id),
    skip: int = 0,
    limit: int = 100,
):
    return await paged(db.coupons, {"tenant_id": tenant_id}, "created_at", -1, skip, limit)


@router.post("/events")
async def create_event(
    payload: EventIn,
    tenant_id: str = Depends(get_tenant_id),
    _=Depends(require_roles(Role.SUPER_ADMIN, Role.ADMIN, Role.INSTRUCTOR)),
):
    now = datetime.now(timezone.utc)
    data = payload.model_dump() | {"tenant_id": tenant_id, "created_at": now, "updated_at": now}
    res = await db.events.insert_one(data)
    await ws_manager.broadcast(f"tenant:{tenant_id}", {"type": "event.created", "data": {"title": data["title"]}})
    recipient_ids = await _tenant_user_ids(tenant_id)
    await _create_user_notifications(
        tenant_id=tenant_id,
        user_ids=recipient_ids,
        title="New school event",
        message=f"{data['title']} has been announced.",
        meta={"event_id": str(res.inserted_id), "starts_at": data["starts_at"].isoformat()},
    )
    return inserted_response(data, res.inserted_id)


@router.get("/events")
async def list_events(tenant_id: str = Depends(get_tenant_id), skip: int = 0, limit: int = 100):
    return await paged(db.events, {"tenant_id": tenant_id}, "starts_at", 1, skip, limit)


@router.post("/notifications")
async def create_notification(payload: NotificationIn, tenant_id: str = Depends(get_tenant_id)):
    now = datetime.now(timezone.utc)
    data = payload.model_dump() | {"tenant_id": tenant_id, "read": False, "created_at": now, "updated_at": now}
    res = await db.notifications.insert_one(data)
    await ws_manager.broadcast(f"user:{payload.user_id}", {"type": "notification", "data": data})
    await ws_manager.broadcast(f"tenant:{tenant_id}", {"type": "notification.created", "data": data})
    if ObjectId.is_valid(payload.user_id):
        recipient = await db.users.find_one({"_id": ObjectId(payload.user_id), "tenant_id": tenant_id}, {"email": 1})
        if recipient and recipient.get("email"):
            await send_transactional_email(
                str(recipient.get("email")),
                f"{settings.app_name}: {payload.title}",
                payload.message,
            )
    return inserted_response(data, res.inserted_id)


@router.get("/notifications")
async def list_notifications(user=Depends(get_current_user), skip: int = 0, limit: int = 100):
    role = user.get("role")
    tenant_id = user.get("tenant_id")
    if role in {Role.ADMIN.value, Role.SUB_ADMIN.value, Role.SUPER_ADMIN.value}:
        query = {"tenant_id": tenant_id} if tenant_id else {"user_id": user["sub"]}
    else:
        query = {"user_id": user["sub"]}
    return await paged(db.notifications, query, "created_at", -1, skip, limit)


@router.patch("/notifications/read-all")
async def mark_notifications_read(user=Depends(get_current_user)):
    role = user.get("role")
    tenant_id = user.get("tenant_id")
    if role in {Role.ADMIN.value, Role.SUB_ADMIN.value, Role.SUPER_ADMIN.value} and tenant_id:
        query = {"tenant_id": tenant_id, "read": False}
    else:
        query = {"user_id": user["sub"], "read": False}
    await db.notifications.update_many(query, {"$set": {"read": True, "updated_at": datetime.now(timezone.utc)}})
    return {"message": "Marked all as read"}


@router.post("/payments/order")
async def create_payment_order(payload: RazorpayOrderIn, tenant_id: str = Depends(get_tenant_id), user=Depends(get_current_user)):
    now = datetime.now(timezone.utc)
    amount_paise = int(round(payload.amount * 100))
    if amount_paise <= 0:
        raise HTTPException(status_code=400, detail="Amount must be greater than zero")

    order_id = f"order_local_{ObjectId()}"
    currency = "INR"

    # Create a real Razorpay order when keys are configured; otherwise keep local fallback for development.
    if settings.razorpay_key_id and settings.razorpay_key_secret:
        try:
            import razorpay

            client = razorpay.Client(auth=(settings.razorpay_key_id, settings.razorpay_key_secret))
            razorpay_order = client.order.create(
                {
                    "amount": amount_paise,
                    "currency": currency,
                    "receipt": f"lms_{ObjectId()}",
                    "notes": {
                        "tenant_id": tenant_id or "",
                        "user_id": user.get("sub", ""),
                        "target_id": payload.target_id,
                        "enrollment_type": payload.enrollment_type,
                    },
                }
            )
            if razorpay_order and razorpay_order.get("id"):
                order_id = razorpay_order["id"]
                currency = razorpay_order.get("currency", currency)
        except Exception:  # noqa: BLE001
            pass

    data = {
        "tenant_id": tenant_id,
        "user_id": user["sub"],
        "target_id": payload.target_id,
        "amount": payload.amount,
        "amount_paise": amount_paise,
        "order_id": order_id,
        "currency": currency,
        "status": "created",
        "created_at": now,
    }
    await db.payments.insert_one(data)
    return {"order_id": order_id, "amount": amount_paise, "currency": currency, "key_id": settings.razorpay_key_id}


@router.get("/payments")
async def list_payments(
    tenant_id: str = Depends(get_tenant_id),
    skip: int = 0,
    limit: int = 100,
    status: str | None = None,
    _=Depends(require_roles(Role.SUPER_ADMIN, Role.ADMIN)),
):
    query = {"tenant_id": tenant_id} if tenant_id else {}
    if status:
        query["status"] = status
    return await paged(db.payments, query, "created_at", -1, skip, limit)


@router.post("/payments/verify")
async def verify_payment(payload: RazorpayVerifyIn, tenant_id: str = Depends(get_tenant_id), user=Depends(get_current_user)):
    if settings.razorpay_key_secret:
        is_valid = verify_razorpay_signature(
            payload.razorpay_order_id, payload.razorpay_payment_id, payload.razorpay_signature
        )
        if not is_valid:
            raise HTTPException(status_code=400, detail="Invalid payment signature")

    payment = await db.payments.find_one({"order_id": payload.razorpay_order_id})
    if not payment:
        raise HTTPException(status_code=404, detail="Payment order not found")

    commission = round(payment["amount"] * settings.platform_commission_percent / 100, 2)
    instructor_amount = payment["amount"] - commission
    await db.payments.update_one(
        {"_id": payment["_id"]},
        {
            "$set": {
                "status": "captured",
                "payment_id": payload.razorpay_payment_id,
                "platform_commission": commission,
                "instructor_amount": instructor_amount,
                "captured_at": datetime.now(timezone.utc),
            }
        },
    )
    await ws_manager.broadcast(
        f"tenant:{tenant_id}",
        {"type": "payment.captured", "data": {"amount": payment["amount"], "user_id": user["sub"]}},
    )
    admin_ids = await _tenant_user_ids(tenant_id, roles=[Role.ADMIN.value, Role.SUB_ADMIN.value, Role.SUPER_ADMIN.value])
    await _create_user_notifications(
        tenant_id=tenant_id,
        user_ids=[payment.get("user_id", ""), *admin_ids],
        title="Payment successful",
        message=f"Payment of INR {payment['amount']} was captured successfully.",
        meta={"order_id": payload.razorpay_order_id, "payment_id": payload.razorpay_payment_id},
    )
    return {"message": "Payment verified"}


@router.post("/payments/webhook")
async def razorpay_webhook(
    request: Request,
    x_razorpay_signature: str = Header(default=""),
):
    payload = await request.body()
    if settings.razorpay_webhook_secret and not verify_webhook_signature(payload, x_razorpay_signature):
        raise HTTPException(status_code=400, detail="Invalid webhook signature")
    event = await request.json()
    await db.webhooks.insert_one({"event": event, "received_at": datetime.now(timezone.utc)})
    return {"ok": True}


@router.get("/platform/settings")
async def get_platform_settings(_=Depends(require_roles(Role.SUPER_ADMIN))):
    settings_doc = await db.platform_settings.find_one({"key": "global"})
    if not settings_doc:
        return {"commission_percent": settings.platform_commission_percent}
    return {"commission_percent": settings_doc.get("commission_percent", settings.platform_commission_percent)}


@router.put("/platform/settings")
async def update_platform_settings(payload: PlatformSettingsIn, _=Depends(require_roles(Role.SUPER_ADMIN))):
    await db.platform_settings.update_one(
        {"key": "global"},
        {"$set": {"key": "global", "commission_percent": payload.commission_percent, "updated_at": datetime.now(timezone.utc)}},
        upsert=True,
    )
    return {"message": "Platform settings updated"}


@router.post("/plans")
async def create_plan(
    payload: PlanIn,
    tenant_id: str = Depends(get_tenant_id),
    user=Depends(require_roles(Role.SUPER_ADMIN, Role.ADMIN)),
):
    now = datetime.now(timezone.utc)
    data = payload.model_dump() | {
        "tenant_id": tenant_id,
        "created_by": user.get("sub"),
        "created_at": now,
        "updated_at": now,
    }
    res = await db.plans.insert_one(data)
    return inserted_response(data, res.inserted_id)


@router.get("/plans")
async def list_plans(
    tenant_id: str = Depends(get_tenant_id),
    user=Depends(get_current_user),
    skip: int = 0,
    limit: int = 100,
    active_only: bool = False,
):
    role = user.get("role")
    query = {"tenant_id": tenant_id} if tenant_id else {}

    if role == Role.SUPER_ADMIN.value and not tenant_id:
        query = {}

    if active_only:
        query["active"] = True

    return await paged(db.plans, query, "created_at", -1, skip, limit)


@router.post("/library-resources")
async def create_library_resource(
    payload: LibraryResourceIn,
    tenant_id: str = Depends(get_tenant_id),
    user=Depends(require_roles(Role.SUPER_ADMIN, Role.ADMIN, Role.INSTRUCTOR)),
):
    now = datetime.now(timezone.utc)
    data = payload.model_dump() | {
        "tenant_id": tenant_id,
        "uploaded_by": user.get("sub"),
        "created_at": now,
        "updated_at": now,
        "published": True,
    }
    res = await db.library_resources.insert_one(data)
    await ws_manager.broadcast(f"tenant:{tenant_id}", {"type": "library_resource.created", "data": {"title": data["title"]}})
    return inserted_response(data, res.inserted_id)


@router.get("/library-resources")
async def list_library_resources(
    tenant_id: str = Depends(get_tenant_id),
    skip: int = 0,
    limit: int = 100,
    q: str | None = None,
):
    query = {"tenant_id": tenant_id} if tenant_id else {}
    if q:
        query["title"] = {"$regex": q, "$options": "i"}
    return await paged(db.library_resources, query, "created_at", -1, skip, limit)


@router.post("/reports/generate")
async def generate_report(
    payload: ReportGenerateIn,
    tenant_id: str = Depends(get_tenant_id),
    user=Depends(get_current_user),
):
    now = datetime.now(timezone.utc)
    item = {
        "tenant_id": tenant_id,
        "report_type": payload.report_type,
        "file_name": f"{payload.report_type}_{int(now.timestamp())}.csv",
        "status": "ready",
        "generated_by": user.get("sub"),
        "created_at": now,
        "size_kb": 256,
    }
    res = await db.reports.insert_one(item)
    return inserted_response(item, res.inserted_id)


@router.get("/reports")
async def list_reports(
    tenant_id: str = Depends(get_tenant_id),
    skip: int = 0,
    limit: int = 100,
):
    return await paged(db.reports, {"tenant_id": tenant_id}, "created_at", -1, skip, limit)
