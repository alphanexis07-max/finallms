
# ...existing code...

from fastapi import APIRouter, Depends, HTTPException, Query
from app.deps.auth import get_current_user, get_tenant_id, require_roles
from app.db import mongo
from app.models.enums import Role
from app.schemas.instructor import CertificateUploadIn
from app.services.realtime import ws_manager
from bson import ObjectId
from datetime import datetime

router = APIRouter(prefix="/admin", tags=["Admin"])

@router.get("/tests/{test_id}/results")
async def get_test_results(test_id: str, user=Depends(get_current_user)):
    admin_required(user)
    # Fetch all attempts for this test
    attempts_cursor = mongo.db.test_attempts.find({"test_id": test_id})
    attempts = []
    total_score = 0
    count = 0
    async for attempt in attempts_cursor:
        score = attempt.get("score", 0)
        total_score += score
        count += 1
        attempts.append({
            "user_id": attempt.get("student_id"),
            "score": score,
            "attempt_id": str(attempt.get("_id")),
        })
    avg_score = (total_score / count) if count else 0
    return {
        "total_attempts": count,
        "average_score": avg_score,
        "attempts": attempts,
    }

# Get courses a student is enrolled in
@router.get("/student-courses")
async def get_student_courses(student_id: str = Query(...), user=Depends(get_current_user)):
    admin_required(user)
    enrollments = mongo.db.enrollments.find({"student_id": student_id})
    course_ids = []
    async for enr in enrollments:
        course_ids.append(enr["course_id"])
    if not course_ids:
        return []
    courses_cursor = mongo.db.courses.find({"_id": {"$in": [ObjectId(cid) for cid in course_ids]}})
    courses = []
    async for c in courses_cursor:
        c["_id"] = str(c["_id"])
        courses.append({
            "_id": c["_id"],
            "title": c.get("title", "Untitled"),
        })
    return courses

def admin_required(user):
    if user["role"] not in {"admin", "sub_admin"}:
        raise HTTPException(status_code=403, detail="Forbidden")
    return user

@router.get("/students/insights")
async def get_admin_student_insights(user=Depends(get_current_user)):
    admin_required(user)
    # Get all unique student_ids from enrollments
    enrolled_ids = set()
    async for enr in mongo.db.enrollments.find({}):
        enrolled_ids.add(enr["student_id"])
    # Fetch only those students who are enrolled
    if not enrolled_ids:
        return {"students": [], "summary": {"total_students": 0, "top_performers": 0, "needs_support": 0}}
    students_cursor = mongo.db.users.find({"role": "student", "_id": {"$in": [ObjectId(sid) for sid in enrolled_ids]}})
    students = []
    async for s in students_cursor:
        s["_id"] = str(s["_id"])
        students.append({
            "student_id": s.get("_id"),
            "name": s.get("full_name", "Unknown"),
            "performance": s.get("performance", 0),
            "flag": s.get("flag", "average"),
        })
    summary = {
        "total_students": len(students),
        "top_performers": sum(1 for s in students if s["flag"] == "top_performer"),
        "needs_support": sum(1 for s in students if s["flag"] == "needs_support"),
    }
    return {"students": students, "summary": summary}

@router.get("/dashboard")
async def get_admin_dashboard(user=Depends(get_current_user)):
    admin_required(user)
    # TODO: Replace with real dashboard data
    return {"courses": 0, "tests": 0}

@router.get("/courses")
async def get_admin_courses(user=Depends(get_current_user)):
    admin_required(user)
    courses_cursor = mongo.db.courses.find({})
    courses = []
    async for c in courses_cursor:
        c["_id"] = str(c["_id"])
        courses.append({
            "_id": c["_id"],
            "title": c.get("title", "Untitled"),
        })
    return courses

@router.post("/certificates")
async def upload_admin_certificate(
    payload: CertificateUploadIn,
    tenant_id: str = Depends(get_tenant_id),
    user=Depends(require_roles(Role.ADMIN, Role.SUPER_ADMIN, Role.SUB_ADMIN)),
):
    def _id_variants(value: str | None) -> list:
        raw = str(value or "").strip()
        if not raw:
            return []
        variants = [raw]
        if ObjectId.is_valid(raw):
            variants.append(ObjectId(raw))
        return variants

    course_variants = _id_variants(payload.course_id)
    student_variants = _id_variants(payload.student_id)
    if not course_variants or not student_variants:
        raise HTTPException(status_code=400, detail="Invalid certificate payload")

    course_query: dict = {"_id": {"$in": course_variants}}
    course = await mongo.db.courses.find_one(course_query)
    if not course and tenant_id:
        # Fallback to no tenant_id for legacy or cross-tenant courses
        course = await mongo.db.courses.find_one({"_id": {"$in": course_variants}, "tenant_id": None})

    # We proceed even if course document is not found, as some "courses" are just string tags in enrollments
    
    enrollment_query: dict = {
        "course_id": {"$in": course_variants},
        "student_id": {"$in": student_variants},
    }
    if tenant_id:
        enrollment_query["tenant_id"] = tenant_id
        enrollment = await mongo.db.enrollments.find_one(enrollment_query)
        if not enrollment:
            # Fallback to no tenant_id
            enrollment_query_legacy = {
                "course_id": {"$in": course_variants},
                "student_id": {"$in": student_variants},
                "tenant_id": None,
            }
            enrollment = await mongo.db.enrollments.find_one(enrollment_query_legacy)
    else:
        enrollment = await mongo.db.enrollments.find_one(enrollment_query)

    if not enrollment:
        # Check if student is in the attendee_ids of any live class for this "course_id"
        # This is a fallback for when the system uses live class attendance instead of formal enrollments
        live_class_query = {
            "course_id": {"$in": course_variants},
            "attendee_ids": {"$in": student_variants}
        }
        if tenant_id:
            live_class_query["tenant_id"] = tenant_id
        
        live_class_check = await mongo.db.live_classes.find_one(live_class_query)
        if not live_class_check and tenant_id:
             live_class_query["tenant_id"] = None
             live_class_check = await mongo.db.live_classes.find_one(live_class_query)
             
        if not live_class_check:
            raise HTTPException(status_code=404, detail="Student is not enrolled or assigned to this course/class")

    now = datetime.utcnow()
    cert = {
        "tenant_id": tenant_id,
        "admin_id": str(user.get("sub") or ""),
        "issued_by": str(user.get("role") or Role.ADMIN.value),
        "student_id": str(payload.student_id),
        "course_id": str(payload.course_id),
        "title": str(payload.title).strip(),
        "file_url": str(payload.file_url or "").strip(),
        "created_at": now,
        "updated_at": now,
    }

    result = await mongo.db.certificates.insert_one(cert)
    cert["_id"] = str(result.inserted_id)

    notification = {
        "tenant_id": tenant_id,
        "user_id": str(payload.student_id),
        "title": "Certificate issued",
        "message": f"A certificate for {cert['title']} is now available.",
        "type": "achievement",
        "meta": {
            "certificate_id": cert["_id"],
            "course_id": cert["course_id"],
            "student_id": cert["student_id"],
        },
        "read": False,
        "created_at": now,
        "updated_at": now,
    }

    await mongo.db.notifications.insert_one(notification)
    await ws_manager.broadcast(f"user:{payload.student_id}", {"type": "notification.created", "data": notification})
    if tenant_id:
        await ws_manager.broadcast(f"tenant:{tenant_id}", {"type": "notification.created", "data": notification})

    return cert
