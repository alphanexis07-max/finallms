from fastapi import APIRouter, Depends, HTTPException
from app.schemas.instructor import (
    CertificateUploadIn,
    CourseCreate,
    CourseUpdate,
    QuestionCreate,
    QuestionUpdate,
    SubmitTest,
    TestCreate,
    TestUpdate,
)

from app.services import instructor as service
from app.db.mongo import get_database
from app.deps.auth import get_current_user

router = APIRouter(prefix="/instructor", tags=["Instructor"])


def instructor_required(user):
    if user["role"] != "instructor":
        raise HTTPException(status_code=403, detail="Forbidden")
    return user


def get_user_id(user: dict) -> str:
    # JWT payload uses "sub" as user id; keep "id" fallback for compatibility.
    user_id = user.get("sub") or user.get("id")
    if not user_id:
        raise HTTPException(status_code=401, detail="Invalid token payload")
    return str(user_id)


# CREATE COURSE
@router.post("/courses")
async def create_course(
    data: CourseCreate,
    db=Depends(get_database),
    user=Depends(get_current_user)
):
    instructor_required(user)
    return await service.create_course(db, data, get_user_id(user))


# GET COURSES
@router.get("/courses")
async def get_courses(
    db=Depends(get_database),
    user=Depends(get_current_user)
):
    instructor_required(user)
    return await service.get_courses(db, get_user_id(user))


# UPDATE COURSE
@router.put("/courses/{course_id}")
async def update_course(
    course_id: str,
    data: CourseUpdate,
    db=Depends(get_database),
    user=Depends(get_current_user)
):
    instructor_required(user)
    return await service.update_course(db, course_id, data, get_user_id(user))


# DELETE COURSE
@router.delete("/courses/{course_id}")
async def delete_course(
    course_id: str,
    db=Depends(get_database),
    user=Depends(get_current_user)
):
    instructor_required(user)
    return await service.delete_course(db, course_id, get_user_id(user))

# routers/instructor.py

@router.get("/classes")
async def get_classes(
    status: str = None,
    db=Depends(get_database),
    user=Depends(get_current_user)
):
    instructor_required(user)
    return await service.get_classes(db, get_user_id(user), status)


# from app.schemas.instructor import TestCreate, TestUpdate


# CREATE TEST
@router.post("/tests")
async def create_test(
    data: TestCreate,
    db=Depends(get_database),
    user=Depends(get_current_user)
):
    instructor_required(user)
    return await service.create_test(db, data, get_user_id(user))


# GET TESTS
@router.get("/tests")
async def get_tests(
    db=Depends(get_database),
    user=Depends(get_current_user)
):
    instructor_required(user)
    return await service.get_tests(db, get_user_id(user))


@router.get("/tests/{test_id}")
async def get_test_by_id(
    test_id: str,
    db=Depends(get_database),
    user=Depends(get_current_user)
):
    instructor_required(user)
    return await service.get_test_by_id(db, test_id, get_user_id(user))


# UPDATE TEST (publish also here)
@router.put("/tests/{test_id}")
async def update_test(
    test_id: str,
    data: TestUpdate,
    db=Depends(get_database),
    user=Depends(get_current_user)
):
    instructor_required(user)
    return await service.update_test(db, test_id, data, get_user_id(user))


@router.delete("/tests/{test_id}")
async def delete_test(
    test_id: str,
    db=Depends(get_database),
    user=Depends(get_current_user)
):
    instructor_required(user)
    return await service.delete_test(db, test_id, get_user_id(user))

# ADD QUESTION
@router.post("/questions")
async def add_question(
    data: QuestionCreate,
    db=Depends(get_database),
    user=Depends(get_current_user)
):
    instructor_required(user)
    return await service.add_question(db, data, get_user_id(user))


@router.patch("/questions/{question_id}")
async def update_question(
    question_id: str,
    data: QuestionUpdate,
    db=Depends(get_database),
    user=Depends(get_current_user)
):
    instructor_required(user)
    return await service.update_question(db, question_id, data, get_user_id(user))


@router.delete("/questions/{question_id}")
async def delete_question(
    question_id: str,
    db=Depends(get_database),
    user=Depends(get_current_user)
):
    instructor_required(user)
    return await service.delete_question(db, question_id, get_user_id(user))


# GET QUESTIONS
@router.get("/tests/{test_id}/questions")
async def get_questions(
    test_id: str,
    db=Depends(get_database),
    user=Depends(get_current_user)
):
    instructor_required(user)
    return await service.get_questions(db, test_id)

@router.post("/tests/submit")
async def submit_test(
    data: SubmitTest,
    db=Depends(get_database),
    user=Depends(get_current_user)
):
    return await service.submit_test(db, data, get_user_id(user))


@router.get("/tests/{test_id}/analytics")
async def test_analytics(
    test_id: str,
    db=Depends(get_database),
    user=Depends(get_current_user)
):
    instructor_required(user)
    return await service.get_test_analytics(db, test_id)


@router.get("/weekly-tests/overview")
async def weekly_test_overview(
    db=Depends(get_database),
    user=Depends(get_current_user)
):
    instructor_required(user)
    return await service.get_weekly_test_overview(db, get_user_id(user))

@router.get("/dashboard")
async def dashboard(
    db=Depends(get_database),
    user=Depends(get_current_user)
):
    instructor_required(user)
    return await service.get_dashboard(db, get_user_id(user))

@router.get("/students/insights")
async def student_insights(
    db=Depends(get_database),
    user=Depends(get_current_user)
):
    instructor_required(user)
    return await service.get_student_insights(db, get_user_id(user), user.get("tenant_id"))


@router.post("/certificates")
async def upload_certificate(
    payload: CertificateUploadIn,
    db=Depends(get_database),
    user=Depends(get_current_user),
):
    instructor_required(user)
    try:
        return await service.upload_certificate(db, get_user_id(user), user.get("tenant_id"), payload)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
    except PermissionError as exc:
        raise HTTPException(status_code=403, detail=str(exc)) from exc
    except LookupError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc
