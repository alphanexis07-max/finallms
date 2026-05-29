# Delete a notification by ID

import asyncio
from datetime import datetime, timedelta, timezone
from bson import ObjectId
from bson.errors import InvalidId
from fastapi import APIRouter, Depends, Header, HTTPException, Request, status
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
    EventUpdateIn,
    LiveClassIn,
    LiveClassUpdateIn,
    NotificationIn,
    PlanIn,
    PlanUpdateIn,
    PlatformSettingsIn,
    LibraryResourceIn,
    RatingIn,
    ReportGenerateIn,
    RazorpayOrderIn,
    ResetPasswordIn,
    RazorpayVerifyIn,
    TenantIn,
    TenantUpdateIn,
    UserIn,
    UserUpdateIn,
)
from app.schemas.instructor import CertificateUploadIn
from app.services.payments import verify_razorpay_signature, verify_webhook_signature
from app.services.email import send_transactional_email
from app.services.realtime import ws_manager
from app.services.zoom import create_zoom_meeting
from app.utils.security import hash_password

router = APIRouter(prefix="/lms", tags=["lms"])

# Delete a notification by ID
@router.delete("/notifications/{notification_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_notification(notification_id: str, user=Depends(get_current_user), tenant_id: str = Depends(get_tenant_id)):
    # Idempotent delete: if the id is invalid/missing, treat as already deleted.
    try:
        notification_oid = ObjectId(notification_id)
    except (InvalidId, TypeError):
        return None

    # Only allow deleting notifications for the current user or tenant.
    role = user.get("role")
    queries = []
    if role in {Role.ADMIN.value, Role.SUB_ADMIN.value, Role.SUPER_ADMIN.value} and tenant_id:
        # Prefer tenant-scoped deletion; fallback to user-scoped for legacy rows.
        queries.append({"_id": notification_oid, "tenant_id": tenant_id})
        queries.append({"_id": notification_oid, "user_id": user["sub"]})
    else:
        queries.append({"_id": notification_oid, "user_id": user["sub"]})

    for query in queries:
        result = await db.notifications.delete_one(query)
        if result.deleted_count > 0:
            break

    return None

# ...existing code...

# Student tests endpoint: fetch tests for enrolled courses/subjects
@router.get("/student/tests")
async def student_tests(
    user=Depends(require_roles(Role.STUDENT)),
    tenant_id: str = Depends(get_tenant_id),
    skip: int = 0,
    limit: int = 100,
):
    student_id = user.get("sub")
    # Only use live_classes for mapping
    enrolled_course_ids = set()
    enrolled_class_names = set()
    subject_candidates = set()
    live_classes = await db.live_classes.find({"attendee_ids": student_id}).to_list(None)
    for lc in live_classes:
        lc_cid = str(lc.get("course_id", "")).strip()
        if lc_cid:
            enrolled_course_ids.add(lc_cid)
            subject_candidates.add(lc_cid.lower())
        lc_cname = str(lc.get("class_name", "")).strip()
        if lc_cname:
            enrolled_class_names.add(lc_cname)
            subject_candidates.add(lc_cname.lower())
        lc_subject = str(lc.get("subject", "")).strip()
        if lc_subject:
            subject_candidates.add(lc_subject.lower())

    test_query = {"is_published": True}
    or_clauses = []
    if enrolled_course_ids:
        or_clauses.append({"course_id": {"$in": list(enrolled_course_ids)}})
    if enrolled_class_names:
        or_clauses.append({"class_name": {"$in": list(enrolled_class_names)}})
    if subject_candidates:
        # Case-insensitive subject match
        or_clauses.append({"subject": {"$in": list(subject_candidates)}})
    if or_clauses:
        test_query["$or"] = or_clauses
    else:
        return {"items": [], "total": 0, "skip": skip, "limit": limit}

    # Case-insensitive subject match in query
    items = [as_dict(x) async for x in db.tests.find(test_query).sort("created_at", -1).skip(skip).limit(limit)
             if x.get("subject", "").strip().lower() in subject_candidates or not subject_candidates]
    total = len(items)
    return {"items": items, "total": total, "skip": skip, "limit": limit}

import asyncio
from datetime import datetime, timedelta, timezone
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
    EventUpdateIn,
    LiveClassIn,
    LiveClassUpdateIn,
    NotificationIn,
    PlanIn,
    PlatformSettingsIn,
    LibraryResourceIn,
    LibraryResourceUpdateIn,
    RatingIn,
    ReportGenerateIn,
    RazorpayOrderIn,
    ResetPasswordIn,
    RazorpayVerifyIn,
    TenantIn,
    TenantUpdateIn,
    UserIn,
    UserUpdateIn,
)
from app.schemas.instructor import CertificateUploadIn
from app.services.payments import verify_razorpay_signature, verify_webhook_signature
from app.services.email import send_transactional_email
from app.services.realtime import ws_manager
from app.services.zoom import create_zoom_meeting
from app.utils.security import hash_password

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


def _money(value) -> float:
    try:
        return round(max(0, float(value or 0)), 2)
    except (TypeError, ValueError):
        return 0.0


def _razorpay_timestamp(value):
    try:
        timestamp = int(value)
    except (TypeError, ValueError):
        return None
    if timestamp <= 0:
        return None
    return datetime.fromtimestamp(timestamp, tz=timezone.utc)


def _payment_item_title(doc: dict | None, enrollment_type: str | None = None) -> str:
    if not doc:
        return ""
    title = str(doc.get("title") or doc.get("name") or doc.get("class_name") or doc.get("subject") or "").strip()
    if title and str(enrollment_type or "").lower() == "live_class" and not title.lower().startswith("live class:"):
        return f"Live Class: {title}"
    return title


async def _resolve_payment_target(payment: dict, tenant_id: str | None = None) -> dict | None:
    target_id = str(payment.get("target_id") or payment.get("course_id") or "").strip()
    if not target_id or not ObjectId.is_valid(target_id):
        return None

    enrollment_type = str(payment.get("enrollment_type") or payment.get("billingType") or payment.get("payment_for") or "").lower()
    collection = db.live_classes if "live" in enrollment_type else db.courses
    query = {"_id": ObjectId(target_id)}
    if tenant_id:
        query["tenant_id"] = tenant_id
    return await collection.find_one(query)


async def _invoice_payment_doc(payment: dict, tenant_id: str | None = None) -> dict:
    payment = as_dict(payment)
    enrollment_type = str(payment.get("enrollment_type") or payment.get("billingType") or payment.get("payment_for") or "course")
    target_doc = await _resolve_payment_target(payment, tenant_id or payment.get("tenant_id"))

    target_title = str(payment.get("target_title") or "").strip() or _payment_item_title(target_doc, enrollment_type)
    if target_title:
        payment["target_title"] = target_title

    paid_amount = _money(payment.get("amount"))
    original_price = _money(
        payment.get("original_price")
        if payment.get("original_price") is not None
        else (target_doc or {}).get("amount")
        if "live" in enrollment_type.lower()
        else (target_doc or {}).get("price")
    )
    if original_price <= 0:
        original_price = _money(payment.get("amount") or payment.get("amount_paise", 0) / 100)

    discount_amount = _money(
        payment.get("discount_amount")
        if payment.get("discount_amount") is not None
        else payment.get("coupon_discount")
    )
    if discount_amount <= 0 and original_price > paid_amount:
        discount_amount = _money(original_price - paid_amount)

    coupon_code = str(payment.get("coupon_code") or "").strip()
    coupon_type = str(payment.get("coupon_type") or payment.get("discount_type") or "").strip()
    coupon_value = payment.get("coupon_value")
    if coupon_code and (not coupon_type or coupon_value in (None, "")):
        coupon = await db.coupons.find_one({"code": coupon_code, "tenant_id": payment.get("tenant_id")})
        if not coupon:
            coupon = await db.coupons.find_one({"code": coupon_code})
        if coupon:
            coupon_type = coupon_type or str(coupon.get("discount_type") or "")
            coupon_value = coupon_value if coupon_value not in (None, "") else coupon.get("value")

    items = payment.get("items") if isinstance(payment.get("items"), list) else []
    if not items:
        items = [
            {
                "description": target_title or "LMS Service",
                "hsn_sac": "998429",
                "amount": original_price,
                "target_id": payment.get("target_id") or payment.get("course_id"),
                "type": enrollment_type,
            }
        ]

    normalized_items = []
    for item in items:
        if not isinstance(item, dict):
            continue
        description = str(item.get("description") or item.get("title") or item.get("name") or target_title or "LMS Service").strip()
        normalized_items.append(
            {
                **item,
                "description": description,
                "hsn_sac": str(item.get("hsn_sac") or "998429"),
                "amount": _money(item.get("amount") if item.get("amount") is not None else original_price),
            }
        )
    if not normalized_items:
        normalized_items = [{"description": target_title or "LMS Service", "hsn_sac": "998429", "amount": original_price}]

    payment["items"] = normalized_items
    payment["original_price"] = original_price
    payment["discount_amount"] = discount_amount
    payment["coupon_code"] = coupon_code
    payment["coupon_type"] = coupon_type or None
    payment["coupon_value"] = _money(coupon_value) if coupon_value not in (None, "") else None
    payment["taxable_amount"] = _money(original_price - discount_amount)
    payment["cgst_amount"] = _money(payment["taxable_amount"] * 0.09)
    payment["sgst_amount"] = _money(payment["taxable_amount"] * 0.09)
    payment["total_amount"] = _money(payment["taxable_amount"] + payment["cgst_amount"] + payment["sgst_amount"])
    return payment


async def _paged_payments(query: dict, sort_field: str, sort_dir: int, skip: int, limit: int, tenant_id: str | None = None):
    total = await db.payments.count_documents(query)
    raw_items = [x async for x in db.payments.find(query).sort(sort_field, sort_dir).skip(skip).limit(limit)]
    items = [await _invoice_payment_doc(x, tenant_id) for x in raw_items]
    return {"items": items, "total": total, "skip": skip, "limit": limit}


async def _rating_map(target_type: str, target_ids: list[str], tenant_id: str | None = None) -> dict[str, dict]:
    ids = [str(x) for x in target_ids if x]
    if not ids:
        return {}

    query: dict = {"target_type": target_type, "target_id": {"$in": ids}}
    if tenant_id:
        query["tenant_id"] = tenant_id

    pipeline = [
        {"$match": query},
        {
            "$group": {
                "_id": "$target_id",
                "avg_rating": {"$avg": "$rating"},
                "rating_count": {"$sum": 1},
            }
        },
    ]
    rows = [x async for x in db.ratings.aggregate(pipeline)]
    output: dict[str, dict] = {}
    for row in rows:
        target_id = str(row.get("_id") or "")
        if not target_id:
            continue
        avg_rating = float(row.get("avg_rating") or 0)
        output[target_id] = {
            "avg_rating": round(avg_rating, 1),
            "rating_count": int(row.get("rating_count") or 0),
        }
    return output


async def _attach_ratings(items: list[dict], *, target_type: str, tenant_id: str | None = None) -> list[dict]:
    target_ids = [str(item.get("_id") or "") for item in items]
    rating_map = await _rating_map(target_type, target_ids, tenant_id)
    enriched = []
    for item in items:
        key = str(item.get("_id") or "")
        summary = rating_map.get(key, {"avg_rating": 0.0, "rating_count": 0})
        enriched_item = {
            **item,
            "avg_rating": summary["avg_rating"],
            "rating_count": summary["rating_count"],
            # Backward-compatible key used by some frontend pages.
            "rating": summary["avg_rating"],
        }
        enriched.append(enriched_item)
    return enriched


def _course_is_active(course: dict | None) -> bool:
    return not course or course.get("is_active") is not False


def _course_inactive_message() -> str:
    return "This course is currently inactive."


def _id_variants(value: str | None) -> list:
    val = str(value or "").strip()
    if not val:
        return []
    variants: list = [val]
    if ObjectId.is_valid(val):
        variants.append(ObjectId(val))
    return variants


def _is_ended_live_class_status(value: str | None) -> bool:
    return str(value or "").strip().lower() in {"ended", "course_ended", "completed", "complete"}


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
    type: str = "course",
    entity_type: str | None = None,
    course_id: str | None = None,
    live_class_id: str | None = None,
    redirect_url: str | None = None,
    meta: dict | None = None,
):
    unique_user_ids = [uid for uid in dict.fromkeys([str(x) for x in user_ids if x])]
    if not unique_user_ids:
        return

    now = datetime.now(timezone.utc)
    notification_meta = {
        **(meta or {}),
        **({"course_id": course_id} if course_id else {}),
        **({"live_class_id": live_class_id} if live_class_id else {}),
        **({"redirect_url": redirect_url} if redirect_url else {}),
        **({"entity_type": entity_type} if entity_type else {}),
    }
    docs = [
        {
            "tenant_id": tenant_id,
            "user_id": uid,
            "title": title,
            "message": message,
            "type": type,
            "entity_type": entity_type,
            "course_id": course_id,
            "live_class_id": live_class_id,
            "redirect_url": redirect_url,
            "meta": notification_meta,
            "read": False,
            "created_at": now,
            "updated_at": now,
        }
        for uid in unique_user_ids
    ]
    await db.notifications.insert_many(docs)

    await ws_manager.broadcast(
        f"tenant:{tenant_id}",
        {"type": "notification.created", "data": {"title": title, "message": message, "meta": notification_meta}},
    )
    for uid in unique_user_ids:
        await ws_manager.broadcast(
            f"user:{uid}",
            {"type": "notification.created", "data": {"title": title, "message": message, "meta": notification_meta}},
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


async def _enrich_notification_docs(items: list[dict], tenant_id: str | None = None) -> list[dict]:
    for item in items:
        meta = item.get("meta") if isinstance(item.get("meta"), dict) else {}
        if not isinstance(meta, dict):
            meta = {}

        course_id = str(item.get("course_id") or meta.get("course_id") or "").strip()
        if course_id and not (meta.get("course_title") or item.get("course_title")):
            course = None
            query: dict = {"_id": ObjectId(course_id)} if ObjectId.is_valid(course_id) else {"_id": course_id}
            if tenant_id:
                query["tenant_id"] = tenant_id
            course = await db.courses.find_one(query, {"title": 1, "name": 1})
            if not course and ObjectId.is_valid(course_id):
                course = await db.courses.find_one({"_id": ObjectId(course_id)}, {"title": 1, "name": 1})
            course_title = str((course or {}).get("title") or (course or {}).get("name") or "").strip()
            if course_title:
                meta["course_title"] = course_title
                item["course_title"] = course_title
                current_message = str(item.get("message") or "")
                if "new enrollment has been completed successfully" in current_message.lower():
                    item["message"] = f"You have successfully enrolled in {course_title}"

        live_class_id = str(item.get("live_class_id") or meta.get("live_class_id") or "").strip()
        if live_class_id and not (meta.get("live_class_title") or item.get("live_class_title")):
            query = {"_id": ObjectId(live_class_id)} if ObjectId.is_valid(live_class_id) else {"_id": live_class_id}
            if tenant_id:
                query["tenant_id"] = tenant_id
            live_class = await db.live_classes.find_one(query, {"title": 1, "class_name": 1, "subject": 1})
            if not live_class and ObjectId.is_valid(live_class_id):
                live_class = await db.live_classes.find_one({"_id": ObjectId(live_class_id)}, {"title": 1, "class_name": 1, "subject": 1})
            live_title = str((live_class or {}).get("title") or (live_class or {}).get("class_name") or (live_class or {}).get("subject") or "").strip()
            if live_title:
                meta["live_class_title"] = live_title
                item["live_class_title"] = live_title

        if meta:
            item["meta"] = meta

    return items


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
    from pymongo.errors import DuplicateKeyError
    now = datetime.now(timezone.utc)
    data = payload.model_dump()
    data["password_hash"] = hash_password(data.pop("password"))
    data["tenant_id"] = tenant_id
    data["is_active"] = True
    data["created_at"] = now
    data["updated_at"] = now
    try:
        res = await db.users.insert_one(data)
    except DuplicateKeyError:
        raise HTTPException(status_code=400, detail="User with this email already exists")
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
    filters = []
    role_value = (role or "").strip().lower()
    instructor_roles = {"instructor", "teacher", "faculty"}

    if tenant_id:
        if role_value in instructor_roles or role_value == "student":
            # Instructor and student lists should include globally created records too.
            filters.append({"$or": [{"tenant_id": tenant_id}, {"tenant_id": None}, {"tenant_id": {"$exists": False}}]})
        else:
            filters.append({"tenant_id": tenant_id})

    if role:
        if role_value == "student":
            filters.append({"role": {"$in": ["student", "Student", "STUDENT", "learner", "Learner", "LEARNER"]}})
        elif role_value == "sub_admin":
            filters.append({"role": {"$in": ["sub_admin", "sub-admin", "Sub_Admin", "SUB_ADMIN", "SUB-ADMIN"]}})
        else:
            filters.append({"role": {"$in": [role, role.upper(), role.capitalize()]}})

    if q:
        filters.append({"$or": [{"full_name": {"$regex": q, "$options": "i"}}, {"email": {"$regex": q, "$options": "i"}}]})

    if not filters:
        query = {}
    elif len(filters) == 1:
        query = filters[0]
    else:
        query = {"$and": filters}

    total = await db.users.count_documents(query)
    users = []
    async for user in db.users.find(query).sort("created_at", -1).skip(skip).limit(limit):
        user["_id"] = str(user["_id"])
        user.pop("password_hash", None)
        users.append(user)
    return {"items": users, "total": total, "skip": skip, "limit": limit}


@router.get("/instructors")
async def list_instructors(
    skip: int = 0,
    limit: int = 300,
    q: str | None = None,
    tenant_id: str = Depends(get_tenant_id),
    _=Depends(require_roles(Role.SUPER_ADMIN, Role.ADMIN, Role.SUB_ADMIN, Role.INSTRUCTOR)),
):
    role_filter = {"$in": ["instructor", "INSTRUCTOR", "Instructor", "teacher", "faculty"]}
    filters = [{"role": role_filter}]

    if tenant_id:
        filters.append({"$or": [{"tenant_id": tenant_id}, {"tenant_id": None}, {"tenant_id": {"$exists": False}}]})

    if q:
        filters.append({"$or": [{"full_name": {"$regex": q, "$options": "i"}}, {"email": {"$regex": q, "$options": "i"}}]})

    query = {"$and": filters} if len(filters) > 1 else filters[0]
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

    base_query = {"_id": ObjectId(user_id)}

    # Try tenant-scoped update first (preferred). If no matching doc, fall back
    # to a legacy/non-tenant-scoped update for backward compatibility.
    user = None
    if tenant_id:
        tenant_query = {**base_query, "tenant_id": tenant_id}
        result = await db.users.update_one(tenant_query, {"$set": updates})
        if result.matched_count > 0:
            user = await db.users.find_one(tenant_query)
        else:
            # Fallback: try to update by _id only (legacy rows without tenant_id)
            result2 = await db.users.update_one(base_query, {"$set": updates})
            if result2.matched_count > 0:
                user = await db.users.find_one(base_query)
    else:
        result = await db.users.update_one(base_query, {"$set": updates})
        if result.matched_count > 0:
            user = await db.users.find_one(base_query)

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
        title="New Course Published",
        message=f"{data['title']} is now available in your course catalog.",
        type="course",
        entity_type="course",
        course_id=str(res.inserted_id),
        redirect_url="/admin/course-management",
        meta={"course_title": data["title"]},
    )
    return inserted_response(data, res.inserted_id)


@router.get("/courses")
async def list_courses(
    tenant_id: str = Depends(get_tenant_id),
    user=Depends(get_current_user),
    skip: int = 0,
    limit: int = 100,
    q: str | None = None,
):
    query = {"tenant_id": tenant_id} if tenant_id else {}
    role = user.get("role")
    if role == Role.INSTRUCTOR.value:
        instructor_id = str(user.get("sub") or "").strip()
        instructor_variants: list = [instructor_id] if instructor_id else []
        if ObjectId.is_valid(instructor_id):
            instructor_variants.append(ObjectId(instructor_id))
        query["$or"] = [
            {"created_by": {"$in": instructor_variants}},
            {"instructor_id": {"$in": instructor_variants}},
            {"instructorId": {"$in": instructor_variants}},
            {"owner_id": {"$in": instructor_variants}},
        ]
    elif role == Role.STUDENT.value:
        student_id = str(user.get("sub") or "").strip()
        enroll_query = {"student_id": student_id}
        if tenant_id:
            enroll_query["tenant_id"] = tenant_id
        enrollments = [x async for x in db.enrollments.find(enroll_query, {"course_id": 1})]
        enrolled_course_ids = []
        for enrollment in enrollments:
            course_id = str(enrollment.get("course_id") or "").strip()
            if not course_id:
                continue
            enrolled_course_ids.append(course_id)
            if ObjectId.is_valid(course_id):
                enrolled_course_ids.append(ObjectId(course_id))
        query["$or"] = [
            {"is_active": {"$ne": False}},
            {"_id": {"$in": enrolled_course_ids}},
        ]
    if q:
        query["title"] = {"$regex": q, "$options": "i"}
    total = await db.courses.count_documents(query)
    items = [as_dict(x) async for x in db.courses.find(query).sort("created_at", -1).skip(skip).limit(limit)]
    items = await _attach_ratings(items, target_type="course", tenant_id=tenant_id)
    return {"items": items, "total": total, "skip": skip, "limit": limit}


@router.get("/public/courses")
async def list_public_courses(
    skip: int = 0,
    limit: int = 100,
    q: str | None = None,
):
    query: dict = {"is_active": {"$ne": False}}
    if q:
        query["title"] = {"$regex": q, "$options": "i"}
    total = await db.courses.count_documents(query)
    items = [as_dict(x) async for x in db.courses.find(query).sort("created_at", -1).skip(skip).limit(limit)]
    items = await _attach_ratings(items, target_type="course", tenant_id=None)
    return {"items": items, "total": total, "skip": skip, "limit": limit}


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
    await ws_manager.broadcast(
        f"tenant:{tenant_id}",
        {
            "type": "course.updated",
            "data": {
                "id": course_id,
                "is_active": updated.get("is_active", True) if updated else True,
                "inactive_message": _course_inactive_message(),
            },
        },
    )
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
            title="New Live Class Scheduled",
            message=f"{payload.title} is scheduled for {payload.start_at.strftime('%d %b %Y, %I:%M %p')}.",
            type="class",
            entity_type="live_class",
            course_id=payload.course_id,
            live_class_id=class_id,
            redirect_url="/student-panel/live-classes",
            meta={"live_class_title": payload.title, "join_url": data.get("join_url", "")},
        )
    await ws_manager.broadcast(f"tenant:{tenant_id}", {"type": "live_class.created", "data": {"title": data["title"]}})
    response = inserted_response(data, res.inserted_id)
    if zoom_error:
        response["message"] = "Live class created but Zoom link generation failed"
    return response


@router.get("/live-classes")
async def list_live_classes(
    tenant_id: str = Depends(get_tenant_id),
    user=Depends(get_current_user),
    skip: int = 0,
    limit: int = 100,
    status: str | None = None,
):
    query = {"tenant_id": tenant_id} if tenant_id else {}
    if status:
        query["status"] = status
    if user.get("role") == Role.STUDENT.value:
        student_id = str(user.get("sub") or "").strip()
        student_variants = _id_variants(student_id)

        course_variants: list = []
        seen_course_variants: set[str] = set()
        enrollment_query: dict = {"student_id": {"$in": student_variants}}
        if tenant_id:
            enrollment_query["tenant_id"] = tenant_id
        async for enrollment in db.enrollments.find(enrollment_query, {"course_id": 1}):
            course_id = str(enrollment.get("course_id") or "").strip()
            if not course_id:
                continue
            variants = [course_id]
            if ObjectId.is_valid(course_id):
                variants.append(ObjectId(course_id))
            for variant in variants:
                key = str(variant)
                if key in seen_course_variants:
                    continue
                seen_course_variants.add(key)
                course_variants.append(variant)

        student_filters: list[dict] = [{"attendee_ids": {"$in": student_variants}}]
        if course_variants:
            student_filters.append({"course_id": {"$in": course_variants}})
        if status and _is_ended_live_class_status(status):
            query["$or"] = student_filters
        else:
            query["$or"] = [
                {"status": {"$nin": ["ended", "course_ended", "completed", "complete"]}},
                {"status": {"$exists": False}},
                *student_filters,
            ]
    elif user.get("role") == Role.INSTRUCTOR.value:
        instructor_id = str(user.get("sub") or "").strip()
        instructor_variants: list = [instructor_id] if instructor_id else []
        if ObjectId.is_valid(instructor_id):
            instructor_variants.append(ObjectId(instructor_id))

        course_variants: list = []
        seen_course_variants: set[str] = set()
        course_query: dict = {"tenant_id": tenant_id} if tenant_id else {}
        course_query["$or"] = [
            {"created_by": {"$in": instructor_variants}},
            {"instructor_id": {"$in": instructor_variants}},
            {"instructorId": {"$in": instructor_variants}},
            {"owner_id": {"$in": instructor_variants}},
        ]
        async for course in db.courses.find(course_query, {"_id": 1}):
            course_id = str(course.get("_id") or "").strip()
            if not course_id:
                continue
            variants = [course_id]
            if ObjectId.is_valid(course_id):
                variants.append(ObjectId(course_id))
            for variant in variants:
                key = str(variant)
                if key in seen_course_variants:
                    continue
                seen_course_variants.add(key)
                course_variants.append(variant)

        instructor_filters: list[dict] = [
            {"instructor_id": {"$in": instructor_variants}},
            {"instructorId": {"$in": instructor_variants}},
            {"host_id": {"$in": instructor_variants}},
            {"instructor": {"$in": instructor_variants}},
        ]
        if course_variants:
            instructor_filters.append({"course_id": {"$in": course_variants}})
        query["$or"] = instructor_filters
    total = await db.live_classes.count_documents(query)
    raw_items = [x async for x in db.live_classes.find(query).sort("start_at", 1).skip(skip).limit(limit)]
    if user.get("role") == Role.STUDENT.value:
        student_id = str(user.get("sub") or "").strip()
        student_variants = _id_variants(student_id)

        async def student_has_live_class_certificate(item: dict) -> bool:
            cert_or: list[dict] = []
            for variant in _id_variants(str(item.get("_id") or "")):
                cert_or.append({"live_class_id": variant})
                cert_or.append({"target_id": variant})
            for variant in _id_variants(str(item.get("course_id") or "")):
                cert_or.append({"course_id": variant})
            if not cert_or:
                return False

            cert_query: dict = {"student_id": {"$in": student_variants}, "$or": cert_or}
            if tenant_id:
                cert_query["tenant_id"] = tenant_id
            return await db.certificates.find_one(cert_query, {"_id": 1}) is not None

        visible_items = []
        for item in raw_items:
            attendee_ids = [str(x) for x in (item.get("attendee_ids") or [])]
            class_id = str(item.get("_id") or "")
            course_id = str(item.get("course_id") or "")
            enrolled = (
                (student_id and student_id in attendee_ids)
                or any(str(variant) == course_id for variant in course_variants)
            )
            if not _is_ended_live_class_status(item.get("status")):
                visible_items.append(item)
                continue
            if enrolled and await student_has_live_class_certificate(item):
                item["has_certificate"] = True
                item["status"] = "completed"
                visible_items.append(item)
        raw_items = visible_items
        total = len(raw_items)

    items = [as_dict(x) for x in raw_items]
    items = await _attach_ratings(items, target_type="live_class", tenant_id=tenant_id)
    return {"items": items, "total": total, "skip": skip, "limit": limit}


@router.get("/public/live-classes")
async def list_public_live_classes(
    skip: int = 0,
    limit: int = 100,
    status: str | None = None,
):
    query: dict = {"status": {"$nin": ["ended", "course_ended", "completed", "complete"]}}
    if status:
        if _is_ended_live_class_status(status):
            return {"items": [], "total": 0, "skip": skip, "limit": limit}
        query["status"] = status
    total = await db.live_classes.count_documents(query)
    items = [as_dict(x) async for x in db.live_classes.find(query).sort("start_at", 1).skip(skip).limit(limit)]
    return {"items": items, "total": total, "skip": skip, "limit": limit}


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
    existing = await db.live_classes.find_one({"_id": ObjectId(live_class_id), "tenant_id": tenant_id})
    if not existing:
        raise HTTPException(status_code=404, detail="Live class not found")
    next_status = str(updates.get("status") or "").strip().lower()
    if _is_ended_live_class_status(existing.get("status")) and next_status and not _is_ended_live_class_status(next_status):
        raise HTTPException(status_code=400, detail="Completed live classes cannot be restarted. Create a new live class instead.")
    if next_status and _is_ended_live_class_status(next_status):
        updates["status"] = "ended"
        updates["ended_at"] = datetime.now(timezone.utc)
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
                title="Live Class Schedule Updated",
                message=f"{item.get('title', 'Live class')} schedule was updated.",
                type="class",
                entity_type="live_class",
                course_id=str(item.get("course_id") or ""),
                live_class_id=live_class_id,
                redirect_url="/student-panel/live-classes",
                meta={"live_class_title": item.get("title", "Live class"), "join_url": item.get("join_url", "")},
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
async def delete_live_class(
    live_class_id: str,
    tenant_id: str = Depends(get_tenant_id),
    _=Depends(require_roles(Role.SUPER_ADMIN, Role.ADMIN, Role.INSTRUCTOR)),
):
    query = {"_id": ObjectId(live_class_id), "tenant_id": tenant_id}
    item = await db.live_classes.find_one(query)
    if not item:
        raise HTTPException(status_code=404, detail="Live class not found")

    result = await db.live_classes.delete_one(query)
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Live class not found")

    # Notify users
    recipients = {item.get("instructor_id"), *(item.get("attendee_ids") or [])}
    recipients = [uid for uid in recipients if uid]
    if recipients:
        await _create_user_notifications(
            tenant_id=tenant_id,
            user_ids=recipients,
            title="Live Class Cancelled",
            message=f"{item.get('title', 'A live class')} has been removed.",
            type="class",
            entity_type="live_class",
            course_id=str(item.get("course_id") or ""),
            live_class_id=live_class_id,
            redirect_url="/student-panel/live-classes",
            meta={"live_class_title": item.get("title", "Live class")},
        )
    await ws_manager.broadcast(f"tenant:{tenant_id}", {"type": "live_class.deleted", "data": {"id": live_class_id}})
    return {"message": "Live class deleted"}


@router.post("/enrollments")
async def create_enrollment(payload: EnrollmentIn, tenant_id: str = Depends(get_tenant_id)):
    now = datetime.now(timezone.utc)
    course = None
    if ObjectId.is_valid(payload.course_id):
        course = await db.courses.find_one({"_id": ObjectId(payload.course_id)})
    if course and not _course_is_active(course):
        raise HTTPException(status_code=400, detail=_course_inactive_message())
    data = payload.model_dump() | {"tenant_id": tenant_id, "created_at": now, "updated_at": now}
    res = await db.enrollments.insert_one(data)
    course_title = str((course or {}).get("title") or "your course")
    student = None
    if ObjectId.is_valid(payload.student_id):
        student = await db.users.find_one({"_id": ObjectId(payload.student_id)})
    student_name = str((student or {}).get("full_name") or (student or {}).get("name") or "A student")
    # --- Backend fix: Also add student_id to attendee_ids of the corresponding live class ---
    # Try to update all live classes with this course_id to add the student to attendee_ids
    await db.live_classes.update_many(
        {"course_id": payload.course_id},
        {"$addToSet": {"attendee_ids": payload.student_id}}
    )
    await ws_manager.broadcast(f"tenant:{tenant_id}", {"type": "enrollment.created", "data": data})
    admin_ids = await _tenant_user_ids(
        tenant_id,
        roles=[Role.ADMIN.value, Role.SUB_ADMIN.value, Role.SUPER_ADMIN.value, Role.INSTRUCTOR.value],
    )
    await _create_user_notifications(
        tenant_id=tenant_id,
        user_ids=[payload.student_id],
        title="Enrollment Successful",
        message=f"You have successfully enrolled in {course_title}",
        type="course",
        entity_type="course",
        course_id=payload.course_id,
        redirect_url="/student-panel/my-courses",
        meta={"course_title": course_title, "student_id": payload.student_id},
    )
    await _create_user_notifications(
        tenant_id=tenant_id,
        user_ids=admin_ids,
        title="New Student Enrollment",
        message=f"{student_name} enrolled in {course_title}.",
        type="course",
        entity_type="course",
        course_id=payload.course_id,
        redirect_url="/admin/student-management",
        meta={"course_title": course_title, "student_id": payload.student_id, "student_name": student_name},
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


@router.post("/ratings")
async def upsert_rating(
    payload: RatingIn,
    tenant_id: str = Depends(get_tenant_id),
    user=Depends(require_roles(Role.STUDENT)),
):
    student_id = user.get("sub")
    now = datetime.now(timezone.utc)
    effective_tenant_id = tenant_id

    def _id_variants(value: str | None) -> list:
        val = str(value or "").strip()
        if not val:
            return []
        variants: list = [val]
        if ObjectId.is_valid(val):
            variants.append(ObjectId(val))
        return variants

    student_variants = _id_variants(student_id)
    if not student_variants:
        raise HTTPException(status_code=401, detail="Invalid student identity")

    async def _find_enrollment(course_variants: list) -> dict | None:
        base_query = {
            "student_id": {"$in": student_variants},
            "course_id": {"$in": course_variants},
        }
        # Primary path: tenant scoped lookup.
        if tenant_id:
            scoped_query = {**base_query, "tenant_id": tenant_id}
            hit = await db.enrollments.find_one(scoped_query)
            if hit:
                return hit
        # Fallback path: legacy rows that may not have tenant_id set.
        return await db.enrollments.find_one(base_query)

    if payload.target_type == "course":
        course_variants = _id_variants(payload.target_id)
        enrolled = await _find_enrollment(course_variants)
        if not enrolled:
            raise HTTPException(status_code=403, detail="You can only rate enrolled courses")
        effective_tenant_id = effective_tenant_id or enrolled.get("tenant_id")
    else:
        if not ObjectId.is_valid(payload.target_id):
            raise HTTPException(status_code=400, detail="Invalid live class id")
        live_class_query = {"_id": ObjectId(payload.target_id)}
        if tenant_id:
            live_class_query["tenant_id"] = tenant_id
        live_class = await db.live_classes.find_one(live_class_query)
        if not live_class:
            raise HTTPException(status_code=404, detail="Live class not found")
        effective_tenant_id = effective_tenant_id or live_class.get("tenant_id")
        course_variants = _id_variants(str(live_class.get("course_id") or ""))
        enrolled = await _find_enrollment(course_variants)
        if not enrolled:
            raise HTTPException(status_code=403, detail="You can only rate enrolled live classes")
        effective_tenant_id = effective_tenant_id or enrolled.get("tenant_id")

    query = {
        "student_id": str(student_id),
        "target_type": payload.target_type,
        "target_id": payload.target_id,
    }
    if effective_tenant_id:
        query["tenant_id"] = effective_tenant_id
    updates = {
        "$set": {
            "tenant_id": effective_tenant_id,
            "rating": payload.rating,
            "comment": payload.comment or "",
            "updated_at": now,
        },
        "$setOnInsert": {"created_at": now},
    }
    await db.ratings.update_one(query, updates, upsert=True)
    saved = await db.ratings.find_one(query)
    return as_dict(saved)


@router.get("/ratings")
async def list_ratings(
    tenant_id: str = Depends(get_tenant_id),
    user=Depends(get_current_user),
    target_type: str | None = None,
    target_id: str | None = None,
    mine: bool = False,
    skip: int = 0,
    limit: int = 200,
):
    query: dict = {"tenant_id": tenant_id} if tenant_id else {}
    if target_type:
        query["target_type"] = target_type
    if target_id:
        query["target_id"] = target_id

    if mine or user.get("role") == Role.STUDENT.value:
        query["student_id"] = user.get("sub")

    return await paged(db.ratings, query, "updated_at", -1, skip, limit)


@router.get("/dashboard/admin")
async def admin_dashboard(tenant_id: str = Depends(get_tenant_id), _=Depends(require_roles(Role.ADMIN, Role.SUPER_ADMIN, Role.SUB_ADMIN))):
    now = datetime.now(timezone.utc)
    month_start = datetime(now.year, now.month, 1, tzinfo=timezone.utc)
    prev_month_start = (
        datetime(now.year - 1, 12, 1, tzinfo=timezone.utc)
        if now.month == 1
        else datetime(now.year, now.month - 1, 1, tzinfo=timezone.utc)
    )
    day_start = now - timedelta(hours=24)

    def scoped_query(extra: dict | None = None) -> dict:
        query = {"tenant_id": tenant_id} if tenant_id else {}
        if extra:
            query.update(extra)
        return query

    def payment_query(extra: dict | None = None) -> dict:
        if tenant_id:
            query: dict = {
                "$or": [
                    {"tenant_id": tenant_id},
                    {"tenant_id": None},
                    {"tenant_id": {"$exists": False}},
                ]
            }
        else:
            query = {}
        if extra:
            if "$or" in query and "$or" in extra:
                return {"$and": [query, extra]}
            query.update(extra)
        return query

    async def sum_payment_amount(match: dict) -> float:
        docs = [
            x
            async for x in db.payments.aggregate(
                [
                    {"$match": match},
                    {
                        "$group": {
                            "_id": None,
                            "total": {
                                "$sum": {
                                    "$subtract": [
                                        {"$ifNull": ["$amount", 0]},
                                        {"$ifNull": ["$refund_amount", 0]},
                                    ]
                                }
                            },
                        }
                    },
                ]
            )
        ]
        return round(float(docs[0]["total"]), 2) if docs else 0

    captured_match = payment_query({"status": "captured"})
    captured_month_match = payment_query(
        {
            "status": "captured",
            "$or": [
                {"captured_at": {"$gte": month_start}},
                {"captured_at": {"$exists": False}, "created_at": {"$gte": month_start}},
            ],
        }
    )
    captured_prev_month_match = payment_query(
        {
            "status": "captured",
            "$or": [
                {"captured_at": {"$gte": prev_month_start, "$lt": month_start}},
                {"captured_at": {"$exists": False}, "created_at": {"$gte": prev_month_start, "$lt": month_start}},
            ],
        }
    )
    captured_today_match = payment_query(
        {
            "status": "captured",
            "$or": [
                {"captured_at": {"$gte": day_start}},
                {"captured_at": {"$exists": False}, "created_at": {"$gte": day_start}},
            ],
        }
    )

    students = await db.users.count_documents(scoped_query({"role": "student", "is_active": {"$ne": False}}))
    instructors = await db.users.count_documents(scoped_query({"role": "instructor", "is_active": {"$ne": False}}))
    courses = await db.courses.count_documents(scoped_query())
    draft_courses = await db.courses.count_documents(
        scoped_query(
            {
                "$or": [
                    {"status": "draft"},
                    {"published": False},
                    {"is_published": False},
                ]
            }
        )
    )
    live_classes = await db.live_classes.count_documents(scoped_query())
    school_events = await db.events.count_documents(scoped_query())

    revenue = await sum_payment_amount(captured_match)
    month_revenue = await sum_payment_amount(captured_month_match)
    prev_month_revenue = await sum_payment_amount(captured_prev_month_match)
    subscription_revenue = await sum_payment_amount(
        payment_query(
            {
                "status": "captured",
                "$or": [
                    {"enrollment_type": "subscription"},
                    {"target_type": "subscription"},
                    {"type": "subscription"},
                ],
            }
        )
    )

    current_month_students = await db.users.count_documents(
        scoped_query({"role": "student", "is_active": {"$ne": False}, "created_at": {"$gte": month_start}})
    )
    previous_month_students = await db.users.count_documents(
        scoped_query(
            {
                "role": "student",
                "is_active": {"$ne": False},
                "created_at": {"$gte": prev_month_start, "$lt": month_start},
            }
        )
    )

    active_enrollment_match = scoped_query(
        {
            "status": {"$nin": ["cancelled", "canceled", "expired", "failed", "pending", "inactive"]},
            "$or": [
                {"expires_at": {"$exists": False}},
                {"expires_at": None},
                {"expires_at": {"$gt": now}},
            ],
        }
    )
    active_enrollment_docs = [
        x
        async for x in db.enrollments.aggregate(
            [
                {"$match": active_enrollment_match},
                {
                    "$group": {
                        "_id": {
                            "student_id": "$student_id",
                            "course_id": "$course_id",
                            "enrollment_type": {"$ifNull": ["$enrollment_type", "course"]},
                        }
                    }
                },
                {"$count": "total"},
            ]
        )
    ]
    active_enrollments = int(active_enrollment_docs[0]["total"]) if active_enrollment_docs else 0
    current_month_enrollment_docs = [
        x
        async for x in db.enrollments.aggregate(
            [
                {"$match": {**active_enrollment_match, "created_at": {"$gte": month_start}}},
                {
                    "$group": {
                        "_id": {
                            "student_id": "$student_id",
                            "course_id": "$course_id",
                            "enrollment_type": {"$ifNull": ["$enrollment_type", "course"]},
                        }
                    }
                },
                {"$count": "total"},
            ]
        )
    ]
    previous_month_enrollment_docs = [
        x
        async for x in db.enrollments.aggregate(
            [
                {"$match": {**active_enrollment_match, "created_at": {"$gte": prev_month_start, "$lt": month_start}}},
                {
                    "$group": {
                        "_id": {
                            "student_id": "$student_id",
                            "course_id": "$course_id",
                            "enrollment_type": {"$ifNull": ["$enrollment_type", "course"]},
                        }
                    }
                },
                {"$count": "total"},
            ]
        )
    ]
    current_month_enrollments = int(current_month_enrollment_docs[0]["total"]) if current_month_enrollment_docs else 0
    previous_month_enrollments = int(previous_month_enrollment_docs[0]["total"]) if previous_month_enrollment_docs else 0

    captured_payment_count = await db.payments.count_documents(captured_match)
    total_payment_count = await db.payments.count_documents(payment_query())
    failed_payment_count = await db.payments.count_documents(payment_query({"status": "failed"}))
    refunded_payment_count = await db.payments.count_documents(payment_query({"status": {"$in": ["refunded", "refund", "partially_refunded"]}}))
    transactions_24h = await db.payments.count_documents(captured_today_match)

    split_docs = [
        x
        async for x in db.payments.aggregate(
            [
                {"$match": captured_match},
                {
                    "$group": {
                        "_id": None,
                        "admin": {"$sum": {"$ifNull": ["$platform_commission", 0]}},
                        "instructor": {"$sum": {"$ifNull": ["$instructor_amount", 0]}},
                    }
                },
            ]
        )
    ]
    admin_share = round(float(split_docs[0]["admin"]), 2) if split_docs else 0
    instructor_share = round(float(split_docs[0]["instructor"]), 2) if split_docs else 0
    split_total = admin_share + instructor_share

    latest_payment = await db.payments.find_one(captured_match, sort=[("captured_at", -1), ("created_at", -1)])
    coupon_docs = [
        x
        async for x in db.coupons.aggregate(
            [
                {"$match": scoped_query()},
                {"$group": {"_id": None, "uses": {"$sum": {"$ifNull": ["$uses", 0]}}}},
            ]
        )
    ]

    def growth_percent(current: float, previous: float) -> float:
        if previous <= 0:
            return 100 if current > 0 else 0
        return round(((current - previous) / previous) * 100, 1)

    return {
        "students": students,
        "instructors": instructors,
        "courses": courses,
        "revenue": revenue,
        "total_students": students,
        "total_instructors": instructors,
        "total_courses": courses,
        "total_live_classes": live_classes,
        "total_school_events": school_events,
        "total_revenue": revenue,
        "subscription_revenue": subscription_revenue,
        "active_enrollments": active_enrollments,
        "draft_courses": draft_courses,
        "current_month_students": current_month_students,
        "previous_month_students": previous_month_students,
        "student_growth_percent": growth_percent(current_month_students, previous_month_students),
        "current_month_revenue": month_revenue,
        "previous_month_revenue": prev_month_revenue,
        "revenue_growth_percent": growth_percent(month_revenue, prev_month_revenue),
        "current_month_enrollments": current_month_enrollments,
        "previous_month_enrollments": previous_month_enrollments,
        "enrollment_growth_percent": growth_percent(current_month_enrollments, previous_month_enrollments),
        "total_payments": total_payment_count,
        "captured_payments": captured_payment_count,
        "failed_payments": failed_payment_count,
        "refunded_payments": refunded_payment_count,
        "avg_order_value": round(revenue / captured_payment_count, 2) if captured_payment_count else 0,
        "refund_rate": round((refunded_payment_count / total_payment_count) * 100, 1) if total_payment_count else 0,
        "transactions_24h": transactions_24h,
        "coupon_usage": int(coupon_docs[0]["uses"]) if coupon_docs else 0,
        "admin_revenue_share": admin_share,
        "instructor_revenue_share": instructor_share,
        "admin_revenue_percent": round((admin_share / split_total) * 100) if split_total else 0,
        "instructor_revenue_percent": round((instructor_share / split_total) * 100) if split_total else 0,
        "latest_captured_payment_amount": float(latest_payment.get("amount") or 0) if latest_payment else 0,
        "latest_admin_share": float(latest_payment.get("platform_commission") or 0) if latest_payment else 0,
        "latest_instructor_share": float(latest_payment.get("instructor_amount") or 0) if latest_payment else 0,
    }


@router.get("/dashboard/internal")
async def admin_dashboard_internal(request: Request):
    """Development-only: return global dashboard stats when called from localhost.
    Useful for debugging without a JWT."""
    host = None
    if request.client:
        host = request.client.host
    if host not in ("127.0.0.1", "::1", "localhost"):
        raise HTTPException(status_code=403, detail="Forbidden")

    students = await db.users.count_documents({"role": "student"})
    instructors = await db.users.count_documents({"role": "instructor"})
    courses = await db.courses.count_documents({})
    revenue_pipeline = [
        {"$match": {"status": "captured"}},
        {"$group": {"_id": None, "total": {"$sum": "$amount"}}},
    ]
    revenue_docs = [x async for x in db.payments.aggregate(revenue_pipeline)]
    revenue = revenue_docs[0]["total"] if revenue_docs else 0
    live_classes = await db.live_classes.count_documents({})

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


@router.get("/admin/students/insights")
async def admin_student_insights(
    tenant_id: str = Depends(get_tenant_id),
    _=Depends(require_roles(Role.ADMIN, Role.SUPER_ADMIN, Role.SUB_ADMIN)),
):
    def _id_variants(value: str | None) -> list:
        raw = str(value or "").strip()
        if not raw:
            return []
        variants = [raw]
        if ObjectId.is_valid(raw):
            variants.append(ObjectId(raw))
        return variants

    course_query: dict = {}
    if tenant_id:
        course_query["tenant_id"] = tenant_id
    courses = await db.courses.find(course_query, {"_id": 1}).to_list(None)
    tenant_course_ids = []
    tenant_course_variants = []
    seen_course_variants: set[str] = set()
    for course in courses:
        course_id = course.get("_id")
        if not course_id:
            continue
        course_id_text = str(course_id)
        tenant_course_ids.append(course_id_text)
        for variant in _id_variants(course_id_text):
            key = str(variant)
            if key in seen_course_variants:
                continue
            seen_course_variants.add(key)
            tenant_course_variants.append(variant)

    enrollments = []
    if tenant_id:
        enrollments.extend(await db.enrollments.find({"tenant_id": tenant_id}).to_list(None))
        if tenant_course_variants:
            legacy_query = {
                "$or": [
                    {"tenant_id": None},
                    {"tenant_id": {"$exists": False}},
                ],
                "course_id": {"$in": tenant_course_variants},
            }
            legacy_enrollments = await db.enrollments.find(legacy_query).to_list(None)
            if legacy_enrollments:
                existing_ids = {
                    str(item.get("_id"))
                    for item in enrollments
                    if item.get("_id") is not None
                }
                for enrollment in legacy_enrollments:
                    enrollment_id = str(enrollment.get("_id") or "")
                    if enrollment_id and enrollment_id not in existing_ids:
                        enrollments.append(enrollment)
    else:
        enrollments = await db.enrollments.find({}).to_list(None)

    student_ids: list[str] = []
    seen_students: set[str] = set()
    for enrollment in enrollments:
        sid = str(enrollment.get("student_id") or "").strip()
        if not sid or sid in seen_students:
            continue
        seen_students.add(sid)
        student_ids.append(sid)

    if not student_ids:
        return {
            "summary": {
                "total_students": 0,
                "top_performers": 0,
                "needs_support": 0,
            },
            "students": [],
        }

    student_id_variants = []
    seen_variants: set[str] = set()
    for sid in student_ids:
        for variant in _id_variants(sid):
            key = str(variant)
            if key in seen_variants:
                continue
            seen_variants.add(key)
            student_id_variants.append(variant)

    attempts = await db.test_attempts.find({"student_id": {"$in": student_id_variants}}).to_list(None)

    student_scores: dict[str, dict] = {}
    for attempt in attempts:
        sid = str(attempt.get("student_id") or "").strip()
        if not sid:
            continue

        total = attempt.get("total") or 0
        score = attempt.get("score") or 0
        if sid not in student_scores:
            student_scores[sid] = {"total": 0, "score": 0}

        student_scores[sid]["total"] += total
        student_scores[sid]["score"] += score

    insights = []
    for sid in student_ids:
        summary = student_scores.get(sid, {"total": 0, "score": 0})
        percentage = 0
        if summary["total"] > 0:
            percentage = (summary["score"] / summary["total"]) * 100

        insights.append(
            {
                "student_id": sid,
                "performance": round(percentage, 2),
                "flag": (
                    "top_performer"
                    if percentage >= 80
                    else "needs_support"
                    if percentage < 40
                    else "average"
                ),
            }
        )

    top_performers = len([item for item in insights if item["flag"] == "top_performer"])
    needs_support = len([item for item in insights if item["flag"] == "needs_support"])

    return {
        "summary": {
            "total_students": len(student_ids),
            "top_performers": top_performers,
            "needs_support": needs_support,
        },
        "students": insights,
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
    now = datetime.now(timezone.utc)
    week_end = now + timedelta(days=7)

    def _id_variants(value: str | None) -> list:
        raw = str(value or "").strip()
        if not raw:
            return []
        variants: list = [raw]
        if ObjectId.is_valid(raw):
            variants.append(ObjectId(raw))
        return variants

    instructor_variants = _id_variants(instructor_id)
    if not instructor_variants:
        raise HTTPException(status_code=401, detail="Invalid instructor identity")

    def tenant_or_legacy_query(extra: dict | None = None) -> dict:
        query: dict = {}
        if tenant_id:
            query = {
                "$or": [
                    {"tenant_id": tenant_id},
                    {"tenant_id": None},
                    {"tenant_id": {"$exists": False}},
                ]
            }
        if extra:
            if "$or" in query and "$or" in extra:
                return {"$and": [query, extra]}
            query.update(extra)
        return query

    instructor_course_filter = {
        "$or": [
            {"created_by": {"$in": instructor_variants}},
            {"instructor_id": {"$in": instructor_variants}},
            {"instructorId": {"$in": instructor_variants}},
            {"owner_id": {"$in": instructor_variants}},
        ]
    }
    course_query = tenant_or_legacy_query(instructor_course_filter)
    modules_count = await db.courses.count_documents(course_query)

    course_variants: list = []
    seen_course_variants: set[str] = set()
    async for course in db.courses.find(course_query, {"_id": 1}):
        course_id = str(course.get("_id") or "").strip()
        if not course_id:
            continue
        for variant in _id_variants(course_id):
            key = str(variant)
            if key in seen_course_variants:
                continue
            seen_course_variants.add(key)
            course_variants.append(variant)

    instructor_class_filter: dict = {
        "$or": [
            {"instructor_id": {"$in": instructor_variants}},
            {"instructorId": {"$in": instructor_variants}},
            {"host_id": {"$in": instructor_variants}},
            {"instructor": {"$in": instructor_variants}},
        ]
    }
    if course_variants:
        instructor_class_filter["$or"].append({"course_id": {"$in": course_variants}})

    live_sessions = await db.live_classes.count_documents(
        tenant_or_legacy_query(
            {
                **instructor_class_filter,
                "start_at": {"$gte": now, "$lt": week_end},
                "status": {"$in": ["upcoming", "active", "ongoing", "scheduled"]},
            }
        )
    )
    upcoming_classes = await db.live_classes.count_documents(
        tenant_or_legacy_query(
            {
                **instructor_class_filter,
                "start_at": {"$gte": now},
                "status": {"$in": ["upcoming", "scheduled"]},
            }
        )
    )

    tests_count = await db.tests.count_documents(
        tenant_or_legacy_query(
            {
                "$or": [
                    {"created_by": {"$in": instructor_variants}},
                    {"instructor_id": {"$in": instructor_variants}},
                ]
            }
        )
    )
    published_tests = await db.tests.count_documents(
        tenant_or_legacy_query(
            {
                "$or": [
                    {"created_by": {"$in": instructor_variants}},
                    {"instructor_id": {"$in": instructor_variants}},
                ],
                "$and": [
                    {
                        "$or": [
                            {"is_published": True},
                            {"status": {"$in": ["active", "published", "closed"]}},
                        ]
                    }
                ],
            }
        )
    )

    active_enrollment_match = {
        "status": {"$nin": ["cancelled", "canceled", "expired", "failed", "pending", "inactive"]},
        "$or": [
            {"expires_at": {"$exists": False}},
            {"expires_at": None},
            {"expires_at": {"$gt": now}},
        ],
    }
    if course_variants:
        active_enrollment_match["course_id"] = {"$in": course_variants}
    else:
        active_enrollment_match["course_id"] = {"$in": []}
    student_docs = [
        x
        async for x in db.enrollments.aggregate(
            [
                {"$match": tenant_or_legacy_query(active_enrollment_match)},
                {"$group": {"_id": "$student_id"}},
                {"$count": "total"},
            ]
        )
    ]
    total_students = int(student_docs[0]["total"]) if student_docs else 0

    attempts_match: dict = {}
    test_ids = []
    async for test in db.tests.find(
        tenant_or_legacy_query(
            {
                "$or": [
                    {"created_by": {"$in": instructor_variants}},
                    {"instructor_id": {"$in": instructor_variants}},
                ]
            }
        ),
        {"_id": 1},
    ):
        test_id = str(test.get("_id") or "").strip()
        if test_id:
            test_ids.append(test_id)
    if test_ids:
        attempts_match["test_id"] = {"$in": test_ids}
    total_attempts = await db.test_attempts.count_documents(attempts_match) if test_ids else 0

    revenue_match = tenant_or_legacy_query({"status": "captured"})
    revenue_or = []
    if course_variants:
        revenue_or.append({"target_id": {"$in": [str(x) for x in course_variants]}})
    revenue_or.extend(
        [
            {"instructor_id": {"$in": instructor_variants}},
            {"created_by": {"$in": instructor_variants}},
        ]
    )
    revenue_match = {"$and": [revenue_match, {"$or": revenue_or}]}
    revenue_docs = [
        x
        async for x in db.payments.aggregate(
            [
                {"$match": revenue_match},
                {
                    "$group": {
                        "_id": None,
                        "total": {"$sum": {"$ifNull": ["$instructor_amount", "$amount"]}},
                    }
                },
            ]
        )
    ]
    instructor_revenue = round(float(revenue_docs[0]["total"]), 2) if revenue_docs else 0

    event_count = await db.events.count_documents(tenant_or_legacy_query())
    return {
        "live_sessions_week": live_sessions,
        "upcoming_classes": upcoming_classes,
        "lab_modules": modules_count,
        "weekly_tests": tests_count,
        "published_tests": published_tests,
        "total_students": total_students,
        "total_attempts": total_attempts,
        "instructor_revenue": instructor_revenue,
        "events": event_count,
        "courses": modules_count,
        "tests": tests_count,
    }


@router.get("/dashboard/student")
async def student_dashboard(user=Depends(require_roles(Role.STUDENT))):
    tenant_id = user.get("tenant_id")
    student_id = user.get("sub")
    now = datetime.now(timezone.utc)
    week_end = now + timedelta(days=7)

    def _id_variants(value: str | None) -> list:
        raw = str(value or "").strip()
        if not raw:
            return []
        variants: list = [raw]
        if ObjectId.is_valid(raw):
            variants.append(ObjectId(raw))
        return variants

    student_variants = _id_variants(student_id)
    if not student_variants:
        raise HTTPException(status_code=401, detail="Invalid student identity")

    def tenant_or_legacy_query(extra: dict | None = None) -> dict:
        query: dict = {}
        if tenant_id:
            query = {
                "$or": [
                    {"tenant_id": tenant_id},
                    {"tenant_id": None},
                    {"tenant_id": {"$exists": False}},
                ]
            }
        if extra:
            if "$or" in query and "$or" in extra:
                return {"$and": [query, extra]}
            query.update(extra)
        return query

    active_enrollment_query = tenant_or_legacy_query(
        {
            "student_id": {"$in": student_variants},
            "status": {"$nin": ["cancelled", "canceled", "expired", "failed", "pending", "inactive"]},
            "$or": [
                {"expires_at": {"$exists": False}},
                {"expires_at": None},
                {"expires_at": {"$gt": now}},
            ],
        }
    )
    active_enrollment_docs = [
        x
        async for x in db.enrollments.aggregate(
            [
                {"$match": active_enrollment_query},
                {
                    "$group": {
                        "_id": {
                            "student_id": "$student_id",
                            "course_id": "$course_id",
                            "enrollment_type": {"$ifNull": ["$enrollment_type", "course"]},
                        }
                    }
                },
                {"$count": "total"},
            ]
        )
    ]
    courses_in_progress = int(active_enrollment_docs[0]["total"]) if active_enrollment_docs else 0

    enrolled_course_variants: list = []
    seen_course_variants: set[str] = set()
    async for enrollment in db.enrollments.find(active_enrollment_query, {"course_id": 1}):
        course_id = str(enrollment.get("course_id") or "").strip()
        if not course_id:
            continue
        for variant in _id_variants(course_id):
            key = str(variant)
            if key in seen_course_variants:
                continue
            seen_course_variants.add(key)
            enrolled_course_variants.append(variant)

    live_match: dict = {
        "status": {"$in": ["upcoming", "active", "ongoing", "scheduled"]},
        "start_at": {"$gte": now, "$lt": week_end},
        "$or": [{"attendee_ids": {"$in": student_variants}}],
    }
    if enrolled_course_variants:
        live_match["$or"].append({"course_id": {"$in": enrolled_course_variants}})
    live_this_week = await db.live_classes.count_documents(tenant_or_legacy_query(live_match))

    quiz_attempts = await db.test_attempts.count_documents({"student_id": {"$in": student_variants}})
    certificates = await db.certificates.count_documents(
        tenant_or_legacy_query({"student_id": {"$in": student_variants}})
    )
    notifications_unread = await db.notifications.count_documents(
        {"user_id": {"$in": student_variants}, "read": False}
    )
    return {
        "courses_in_progress": courses_in_progress,
        "live_classes_week": live_this_week,
        "quiz_attempts": quiz_attempts,
        "certificates_earned": certificates,
        "unread_notifications": notifications_unread,
    }


@router.get("/certificates")
async def list_certificates(
    user=Depends(get_current_user),
    tenant_id: str = Depends(get_tenant_id),
    skip: int = 0,
    limit: int = 100,
):
    role = user.get("role")
    query: dict = {"tenant_id": tenant_id} if tenant_id else {}

    if role == Role.STUDENT.value:
        query["student_id"] = user.get("sub")
    elif role in {Role.INSTRUCTOR.value, Role.ADMIN.value, Role.SUB_ADMIN.value, Role.SUPER_ADMIN.value}:
        if not tenant_id:
            query = {}

    return await paged(db.certificates, query, "created_at", -1, skip, limit)


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


@router.delete("/coupons/{coupon_id}", status_code=204)
async def delete_coupon(
    coupon_id: str,
    tenant_id: str = Depends(get_tenant_id),
    _=Depends(require_roles(Role.SUPER_ADMIN, Role.ADMIN, Role.INSTRUCTOR, Role.SUB_ADMIN)),
):
    query = {"_id": ObjectId(coupon_id)}
    if tenant_id:
        query["tenant_id"] = tenant_id
    # Try tenant-scoped delete first; if not matched, allow delete by _id only for legacy rows
    result = await db.coupons.delete_one(query)
    if result.deleted_count == 0 and tenant_id:
        # fallback: delete by id only
        result2 = await db.coupons.delete_one({"_id": ObjectId(coupon_id)})
        if result2.deleted_count == 0:
            # Not found
            raise HTTPException(status_code=404, detail="Coupon not found")
    return None


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
        title="New School Event",
        message=f"{data['title']} has been announced.",
        type="event",
        entity_type="event",
        redirect_url="/student-panel/school-events",
        meta={"event_id": str(res.inserted_id), "event_title": data["title"], "starts_at": data["starts_at"].isoformat()},
    )
    return inserted_response(data, res.inserted_id)


@router.get("/events")
async def list_events(
    tenant_id: str = Depends(get_tenant_id),
    user=Depends(get_current_user),
    skip: int = 0,
    limit: int = 100,
):
    # Product requirement: all students should see all school events.
    if user.get("role") == Role.STUDENT.value:
        return await paged(db.events, {}, "starts_at", 1, skip, limit)

    normalized_tenant_id = str(tenant_id or "").strip()
    if not normalized_tenant_id:
        return await paged(db.events, {}, "starts_at", 1, skip, limit)

    # Primary path: strict tenant-scoped events.
    tenant_result = await paged(db.events, {"tenant_id": normalized_tenant_id}, "starts_at", 1, skip, limit)
    if tenant_result.get("total", 0) > 0:
        return tenant_result

    # Fallback path: include legacy rows where tenant_id was missing.
    legacy_query = {
        "$or": [
            {"tenant_id": normalized_tenant_id},
            {"tenant_id": None},
            {"tenant_id": {"$exists": False}},
        ]
    }
    return await paged(db.events, legacy_query, "starts_at", 1, skip, limit)


@router.patch("/events/{event_id}")
async def update_event(
    event_id: str,
    payload: EventUpdateIn,
    tenant_id: str = Depends(get_tenant_id),
    _=Depends(require_roles(Role.SUPER_ADMIN, Role.ADMIN, Role.INSTRUCTOR)),
):
    updates = {k: v for k, v in payload.model_dump().items() if v is not None}
    if not updates:
        return {"message": "No updates provided"}
    updates["updated_at"] = datetime.now(timezone.utc)
    query = {"_id": ObjectId(event_id)}
    if tenant_id:
        query["tenant_id"] = tenant_id

    result = await db.events.update_one(query, {"$set": updates})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Event not found")

    updated = await db.events.find_one(query)
    await ws_manager.broadcast(f"tenant:{tenant_id}", {"type": "event.updated", "data": {"id": event_id}})
    return as_dict(updated)


@router.delete("/events/{event_id}")
async def delete_event(
    event_id: str,
    tenant_id: str = Depends(get_tenant_id),
    _=Depends(require_roles(Role.SUPER_ADMIN, Role.ADMIN, Role.INSTRUCTOR)),
):
    query = {"_id": ObjectId(event_id)}
    if tenant_id:
        query["tenant_id"] = tenant_id

    result = await db.events.delete_one(query)
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Event not found")

    await ws_manager.broadcast(f"tenant:{tenant_id}", {"type": "event.deleted", "data": {"id": event_id}})
    return {"message": "Event deleted"}


@router.post("/notifications")
async def create_notification(payload: NotificationIn, tenant_id: str = Depends(get_tenant_id)):
    now = datetime.now(timezone.utc)
    data = payload.model_dump() | {"tenant_id": tenant_id, "read": False, "created_at": now, "updated_at": now}
    data["meta"] = {
        **(data.get("meta") or {}),
        **({"course_id": data.get("course_id")} if data.get("course_id") else {}),
        **({"live_class_id": data.get("live_class_id")} if data.get("live_class_id") else {}),
        **({"redirect_url": data.get("redirect_url")} if data.get("redirect_url") else {}),
        **({"entity_type": data.get("entity_type")} if data.get("entity_type") else {}),
    }
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
    result = await paged(db.notifications, query, "created_at", -1, skip, limit)
    result["items"] = await _enrich_notification_docs(result.get("items") or [], tenant_id)
    return result


@router.patch("/notifications/{notification_id}/read")
async def mark_notification_read(notification_id: str, user=Depends(get_current_user)):
    try:
        notification_oid = ObjectId(notification_id)
    except (InvalidId, TypeError):
        raise HTTPException(status_code=400, detail="Invalid notification id")

    role = user.get("role")
    tenant_id = user.get("tenant_id")
    query: dict = {"_id": notification_oid}
    if role in {Role.ADMIN.value, Role.SUB_ADMIN.value, Role.SUPER_ADMIN.value} and tenant_id:
        query["tenant_id"] = tenant_id
    else:
        query["user_id"] = user["sub"]

    result = await db.notifications.update_one(
        query,
        {"$set": {"read": True, "updated_at": datetime.now(timezone.utc)}},
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Notification not found")

    room = f"tenant:{tenant_id}" if role in {Role.ADMIN.value, Role.SUB_ADMIN.value, Role.SUPER_ADMIN.value} and tenant_id else f"user:{user['sub']}"
    await ws_manager.broadcast(room, {"type": "notification.read", "data": {"id": notification_id}})
    return {"message": "Marked as read"}


@router.patch("/notifications/read-all")
async def mark_notifications_read(user=Depends(get_current_user)):
    role = user.get("role")
    tenant_id = user.get("tenant_id")
    if role in {Role.ADMIN.value, Role.SUB_ADMIN.value, Role.SUPER_ADMIN.value} and tenant_id:
        query = {"tenant_id": tenant_id, "read": False}
    else:
        query = {"user_id": user["sub"], "read": False}
    await db.notifications.update_many(query, {"$set": {"read": True, "updated_at": datetime.now(timezone.utc)}})
    room = f"tenant:{tenant_id}" if role in {Role.ADMIN.value, Role.SUB_ADMIN.value, Role.SUPER_ADMIN.value} and tenant_id else f"user:{user['sub']}"
    await ws_manager.broadcast(room, {"type": "notification.read", "data": {"all": True}})
    return {"message": "Marked all as read"}


@router.post("/payments/order")
async def create_payment_order(payload: RazorpayOrderIn, tenant_id: str = Depends(get_tenant_id), user=Depends(get_current_user)):
    now = datetime.now(timezone.utc)
    amount_paise = int(round(payload.amount * 100))
    if amount_paise <= 0:
        raise HTTPException(status_code=400, detail="Amount must be greater than zero")

    target_doc = await _resolve_payment_target(
        {"target_id": payload.target_id, "enrollment_type": payload.enrollment_type, "tenant_id": tenant_id},
        tenant_id,
    )
    enrollment_type = str(payload.enrollment_type or "").lower()
    if enrollment_type == "course" and target_doc and not _course_is_active(target_doc):
        raise HTTPException(status_code=400, detail=_course_inactive_message())
    if enrollment_type == "live_class" and target_doc and _is_ended_live_class_status(target_doc.get("status")):
        raise HTTPException(status_code=400, detail="This live class has ended. Please enroll in a newly scheduled class.")

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

    target_title = str(payload.target_title or "").strip() or _payment_item_title(target_doc, payload.enrollment_type)
    original_price = _money(
        payload.original_price
        if payload.original_price is not None
        else (target_doc or {}).get("amount")
        if str(payload.enrollment_type or "").lower() == "live_class"
        else (target_doc or {}).get("price")
    )
    if original_price <= 0:
        original_price = _money(payload.amount + _money(payload.discount_amount or payload.coupon_discount))
    discount_amount = _money(payload.discount_amount if payload.discount_amount is not None else payload.coupon_discount)
    coupon_code = str(payload.coupon_code or "").strip()
    coupon_type = str(payload.coupon_type or "").strip() or None
    coupon_value = payload.coupon_value
    if coupon_code and (not coupon_type or coupon_value in (None, "")):
        coupon = await db.coupons.find_one({"code": coupon_code, "tenant_id": tenant_id}) or await db.coupons.find_one({"code": coupon_code})
        if coupon:
            coupon_type = coupon_type or coupon.get("discount_type")
            coupon_value = coupon_value if coupon_value not in (None, "") else coupon.get("value")

    items = payload.items or [
        {
            "description": target_title or "LMS Service",
            "hsn_sac": "998429",
            "amount": original_price,
            "target_id": payload.target_id,
            "type": payload.enrollment_type,
        }
    ]

    data = {
        "tenant_id": tenant_id,
        "user_id": user["sub"],
        "target_id": payload.target_id,
        "target_title": target_title,
        "enrollment_type": getattr(payload, "enrollment_type", None),
        "items": items,
        "original_price": original_price,
        "discount_amount": discount_amount,
        "coupon_code": coupon_code,
        "coupon_type": coupon_type,
        "coupon_value": _money(coupon_value) if coupon_value not in (None, "") else None,
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
    _=Depends(require_roles(Role.SUPER_ADMIN, Role.ADMIN, Role.SUB_ADMIN)),
):
    if tenant_id:
        # Include legacy/global payment rows where tenant_id was not persisted.
        query = {
            "$or": [
                {"tenant_id": tenant_id},
                {"tenant_id": None},
                {"tenant_id": {"$exists": False}},
            ]
        }
    else:
        query = {}
    if status:
        query["status"] = status
    return await _paged_payments(query, "created_at", -1, skip, limit, tenant_id)


@router.get("/payments/mine")
async def list_my_payments(user=Depends(get_current_user), skip: int = 0, limit: int = 100):
    """Return payments belonging to the current user (student or any authenticated user)."""
    query = {"user_id": user.get("sub")}
    return await _paged_payments(query, "created_at", -1, skip, limit, user.get("tenant_id"))


@router.get("/payments/resolve-title")
async def resolve_payment_title(target_id: str | None = None, enrollment_type: str | None = None, tenant_id: str = Depends(get_tenant_id)):
    """Resolve a human-friendly title for a payment target (course or live_class)."""
    if not target_id:
        raise HTTPException(status_code=400, detail="target_id is required")

    # Try ObjectId lookup first when valid
    title = None
    if enrollment_type and str(enrollment_type).lower() == 'live_class':
        if ObjectId.is_valid(target_id):
            qry = {"_id": ObjectId(target_id)}
            if tenant_id:
                qry["tenant_id"] = tenant_id
            doc = await db.live_classes.find_one(qry)
            if doc:
                title = str(doc.get('title') or doc.get('class_name') or doc.get('subject') or '')
    else:
        # Default to course lookup
        if ObjectId.is_valid(target_id):
            qry = {"_id": ObjectId(target_id)}
            if tenant_id:
                qry["tenant_id"] = tenant_id
            doc = await db.courses.find_one(qry)
            if doc:
                title = str(doc.get('title') or doc.get('name') or '')

    return {"title": title or ""}


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
    item_title = str(payment.get("target_title") or "LMS purchase")
    await _create_user_notifications(
        tenant_id=tenant_id,
        user_ids=[payment.get("user_id", "")],
        title="Payment Completed",
        message=f"Payment for {item_title} was completed. Amount paid: INR {payment['amount']}.",
        type="payment",
        entity_type="payment",
        course_id=str(payment.get("target_id") or "") if str(payment.get("enrollment_type") or "").lower() == "course" else None,
        live_class_id=str(payment.get("target_id") or "") if str(payment.get("enrollment_type") or "").lower() == "live_class" else None,
        redirect_url="/student-panel/invoices",
        meta={"order_id": payload.razorpay_order_id, "payment_id": payload.razorpay_payment_id, "item_title": item_title},
    )
    await _create_user_notifications(
        tenant_id=tenant_id,
        user_ids=admin_ids,
        title="Payment Completed",
        message=f"Payment received for {item_title}. Amount: INR {payment['amount']}.",
        type="payment",
        entity_type="payment",
        course_id=str(payment.get("target_id") or "") if str(payment.get("enrollment_type") or "").lower() == "course" else None,
        live_class_id=str(payment.get("target_id") or "") if str(payment.get("enrollment_type") or "").lower() == "live_class" else None,
        redirect_url="/admin/payments-coupons",
        meta={"order_id": payload.razorpay_order_id, "payment_id": payload.razorpay_payment_id, "item_title": item_title},
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
    event_type = str(event.get("event") or "")
    payment_entity = (((event.get("payload") or {}).get("payment") or {}).get("entity") or {})
    order_id = payment_entity.get("order_id")
    payment_id = payment_entity.get("id")
    captured_at = _razorpay_timestamp(payment_entity.get("created_at")) or datetime.now(timezone.utc)
    if event_type == "payment.captured" and order_id:
        payment = await db.payments.find_one({"order_id": order_id})
        if payment:
            commission = round(float(payment.get("amount") or 0) * settings.platform_commission_percent / 100, 2)
            await db.payments.update_one(
                {"_id": payment["_id"]},
                {
                    "$set": {
                        "status": "captured",
                        "payment_id": payment_id,
                        "platform_commission": commission,
                        "instructor_amount": round(float(payment.get("amount") or 0) - commission, 2),
                        "captured_at": captured_at,
                        "razorpay_webhook_event": event_type,
                    }
                },
            )
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
    query = {"tenant_id": tenant_id} if tenant_id else {}
    if user.get("role") != Role.SUPER_ADMIN.value:
        query["created_by"] = user.get("sub")
    existing_count = await db.plans.count_documents(query)
    if existing_count >= 3:
        raise HTTPException(status_code=400, detail="Maximum 3 subscription plans are allowed")

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
    elif role in {Role.ADMIN.value, Role.SUB_ADMIN.value}:
        query["created_by"] = user.get("sub")

    if active_only:
        query["active"] = True

    return await paged(db.plans, query, "created_at", -1, skip, limit)


@router.patch("/plans/{plan_id}")
async def update_plan(
    plan_id: str,
    payload: PlanUpdateIn,
    tenant_id: str = Depends(get_tenant_id),
    user=Depends(require_roles(Role.SUPER_ADMIN, Role.ADMIN)),
):
    updates = {k: v for k, v in payload.model_dump().items() if v is not None}
    if not updates:
        return {"message": "No updates provided"}
    updates["updated_at"] = datetime.now(timezone.utc)

    query = {"_id": ObjectId(plan_id)}
    if tenant_id:
        query["tenant_id"] = tenant_id
    if user.get("role") != Role.SUPER_ADMIN.value:
        query["created_by"] = user.get("sub")
    result = await db.plans.update_one(query, {"$set": updates})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Plan not found")

    updated = await db.plans.find_one(query)
    return as_dict(updated)


@router.delete("/plans/{plan_id}")
async def delete_plan(
    plan_id: str,
    tenant_id: str = Depends(get_tenant_id),
    user=Depends(require_roles(Role.SUPER_ADMIN, Role.ADMIN)),
):
    query = {"_id": ObjectId(plan_id)}
    if tenant_id:
        query["tenant_id"] = tenant_id
    if user.get("role") != Role.SUPER_ADMIN.value:
        query["created_by"] = user.get("sub")
    result = await db.plans.delete_one(query)
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Plan not found")
    return {"message": "Plan deleted"}


@router.get("/public/plans")
async def list_public_plans(
    skip: int = 0,
    limit: int = 100,
    active_only: bool = True,
):
    query: dict = {}
    if active_only:
        query["active"] = True
    return await paged(db.plans, query, "created_at", -1, skip, limit)


@router.post("/blogs")
async def create_blog(
    payload: dict,
    tenant_id: str = Depends(get_tenant_id),
    user=Depends(require_roles(Role.SUPER_ADMIN, Role.ADMIN, Role.SUB_ADMIN)),
):
    title = str(payload.get("title") or "").strip()
    content = str(payload.get("content") or "").strip()
    if not title or not content:
        raise HTTPException(status_code=400, detail="title and content are required")

    now = datetime.now(timezone.utc)
    data = {
        "tenant_id": tenant_id,
        "title": title,
        "summary": str(payload.get("summary") or "").strip(),
        "content": content,
        "cover_image": str(payload.get("cover_image") or "").strip(),
        "author_name": str(payload.get("author_name") or "").strip() or "Admin",
        "tags": [str(x).strip() for x in (payload.get("tags") or []) if str(x).strip()],
        "published": bool(payload.get("published", True)),
        "created_by": user.get("sub"),
        "created_at": now,
        "updated_at": now,
    }
    res = await db.blogs.insert_one(data)
    return inserted_response(data, res.inserted_id)


@router.get("/blogs")
async def list_blogs(
    tenant_id: str = Depends(get_tenant_id),
    skip: int = 0,
    limit: int = 100,
    q: str | None = None,
):
    query = {"tenant_id": tenant_id} if tenant_id else {}
    if q:
        query["$or"] = [
            {"title": {"$regex": q, "$options": "i"}},
            {"summary": {"$regex": q, "$options": "i"}},
            {"author_name": {"$regex": q, "$options": "i"}},
        ]
    return await paged(db.blogs, query, "created_at", -1, skip, limit)


@router.get("/public/blogs")
async def list_public_blogs(
    skip: int = 0,
    limit: int = 100,
    q: str | None = None,
):
    query: dict = {"published": True}
    if q:
        query["$or"] = [
            {"title": {"$regex": q, "$options": "i"}},
            {"summary": {"$regex": q, "$options": "i"}},
            {"author_name": {"$regex": q, "$options": "i"}},
        ]
    return await paged(db.blogs, query, "created_at", -1, skip, limit)


@router.patch("/blogs/{blog_id}")
async def update_blog(
    blog_id: str,
    payload: dict,
    tenant_id: str = Depends(get_tenant_id),
    _=Depends(require_roles(Role.SUPER_ADMIN, Role.ADMIN, Role.SUB_ADMIN)),
):
    updates = {}
    for field in ("title", "summary", "content", "cover_image", "author_name", "published"):
        if field in payload:
            updates[field] = payload[field]
    if "tags" in payload:
        updates["tags"] = [str(x).strip() for x in (payload.get("tags") or []) if str(x).strip()]
    if not updates:
        return {"message": "No updates provided"}

    if "title" in updates:
        updates["title"] = str(updates["title"] or "").strip()
    if "content" in updates:
        updates["content"] = str(updates["content"] or "").strip()
    if not str(updates.get("title", "x")).strip() or not str(updates.get("content", "x")).strip():
        raise HTTPException(status_code=400, detail="title and content are required")

    updates["updated_at"] = datetime.now(timezone.utc)
    query = {"_id": ObjectId(blog_id)}
    if tenant_id:
        query["tenant_id"] = tenant_id
    result = await db.blogs.update_one(query, {"$set": updates})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Blog not found")
    updated = await db.blogs.find_one(query)
    return as_dict(updated)


@router.delete("/blogs/{blog_id}")
async def delete_blog(
    blog_id: str,
    tenant_id: str = Depends(get_tenant_id),
    _=Depends(require_roles(Role.SUPER_ADMIN, Role.ADMIN, Role.SUB_ADMIN)),
):
    query = {"_id": ObjectId(blog_id)}
    if tenant_id:
        query["tenant_id"] = tenant_id
    result = await db.blogs.delete_one(query)
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Blog not found")
    return {"ok": True}


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
    # If resource targets a live_class, ensure ID is stored as string
    if data.get("target_id"):
        data["target_id"] = str(data.get("target_id"))
    # Basic validation: if targeting live_class, ensure it exists in tenant
    if data.get("target_type") == "live_class" and data.get("target_id"):
        lc = await db.live_classes.find_one({"_id": ObjectId(data["target_id"])}) if ObjectId.is_valid(data["target_id"]) else None
        if not lc:
            raise HTTPException(status_code=400, detail="Invalid live_class target_id")
    res = await db.library_resources.insert_one(data)
    await ws_manager.broadcast(f"tenant:{tenant_id}", {"type": "library_resource.created", "data": {"title": data["title"]}})
    return inserted_response(data, res.inserted_id)


@router.get("/library-resources")
async def list_library_resources(
    tenant_id: str = Depends(get_tenant_id),
    skip: int = 0,
    limit: int = 100,
    q: str | None = None,
    user=Depends(get_current_user),
):
    query = {"tenant_id": tenant_id} if tenant_id else {}
    if q:
        query["title"] = {"$regex": q, "$options": "i"}

    # Admins and instructors can view all resources
    role = str((user or {}).get("role") or "").lower()
    if role in [r.value for r in (Role.SUPER_ADMIN, Role.ADMIN, Role.INSTRUCTOR)]:
        return await paged(db.library_resources, query, "created_at", -1, skip, limit)

    # For students, only return generic resources (no target) or resources targeted
    # to live classes the student is enrolled in / attending.
    student_id = str(user.get("sub") or "").strip()
    if not student_id:
        return {"items": [], "total": 0}

    # Fetch enrollments for this student (course_ids)
    enrollments = await db.enrollments.find({"student_id": student_id}, {"course_id": 1}).to_list(500)
    course_ids = [str(e.get("course_id")) for e in enrollments if e.get("course_id")]

    # Find live_classes where student is attendee OR whose course_id is in student's enrollments
    live_query = {"tenant_id": tenant_id, "$or": []}
    live_query["$or"].append({"attendee_ids": student_id})
    if course_ids:
        live_query["$or"].append({"course_id": {"$in": course_ids}})
    live_classes = await db.live_classes.find(live_query, {"_id": 1}).to_list(500)
    allowed_live_ids = [str(lc.get("_id")) for lc in live_classes if lc.get("_id")]

    # Build OR filter: resources without a target OR resources targeting allowed live_class ids
    or_filters = [ {"target_type": {"$exists": False}}, {"target_type": None}, {"target_id": {"$in": allowed_live_ids}} ]
    query["$or"] = or_filters

    return await paged(db.library_resources, query, "created_at", -1, skip, limit)


@router.patch("/library-resources/{resource_id}")
async def update_library_resource(
    resource_id: str,
    payload: LibraryResourceUpdateIn,
    tenant_id: str = Depends(get_tenant_id),
    _=Depends(require_roles(Role.SUPER_ADMIN, Role.ADMIN, Role.INSTRUCTOR)),
):
    updates = {k: v for k, v in payload.model_dump().items() if v is not None}
    if not updates:
        return {"message": "No updates provided"}
    updates["updated_at"] = datetime.now(timezone.utc)
    result = await db.library_resources.update_one(
        {"_id": ObjectId(resource_id), "tenant_id": tenant_id}, {"$set": updates}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Library resource not found")
    updated = await db.library_resources.find_one({"_id": ObjectId(resource_id)})
    return as_dict(updated)


@router.delete("/library-resources/{resource_id}")
async def delete_library_resource(
    resource_id: str,
    tenant_id: str = Depends(get_tenant_id),
    _=Depends(require_roles(Role.SUPER_ADMIN, Role.ADMIN, Role.INSTRUCTOR)),
):
    result = await db.library_resources.delete_one({"_id": ObjectId(resource_id), "tenant_id": tenant_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Library resource not found")
    return {"message": "Library resource deleted"}


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
