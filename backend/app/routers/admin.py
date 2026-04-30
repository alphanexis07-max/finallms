
# ...existing code...

from fastapi import APIRouter, Depends, HTTPException, Query
from app.deps.auth import get_current_user
from app.db import mongo
from bson import ObjectId

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
async def upload_admin_certificate(data: dict, user=Depends(get_current_user)):
    admin_required(user)
    # TODO: Implement certificate upload logic
    return {"success": True, "data": data}
