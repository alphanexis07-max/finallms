import re
from fastapi import APIRouter, Depends, HTTPException
from bson import ObjectId
from app.db.mongo import get_database
from app.deps.auth import get_current_user
from app.models.enums import Role
from app.services import student as student_service

router = APIRouter()

@router.get("/student/tests")
async def get_student_tests(db=Depends(get_database), user=Depends(get_current_user)):
    # Only allow students
    if user.get("role") != Role.STUDENT.value:
        raise HTTPException(status_code=403, detail="Only students can access their tests.")
    student_id = user.get("sub")
    # Fetch all tests assigned to this student (customize as needed)
    # For now, fetch all published tests (or filter by enrolled courses)
    tests = await student_service.get_tests_for_student(db, student_id)
    return tests


@router.get("/student/tests/{test_id}/questions")
async def get_student_test_questions(test_id: str, db=Depends(get_database), user=Depends(get_current_user)):
    if user.get("role") != Role.STUDENT.value:
        raise HTTPException(status_code=403, detail="Only students can access test questions.")
    student_id = user.get("sub")
    questions = await student_service.get_test_questions_for_student(db, student_id, test_id)
    if questions is None:
        raise HTTPException(status_code=404, detail="Test not found or not assigned.")
    return {"items": questions}


@router.post("/student/tests/{test_id}/submit")
async def submit_student_test(test_id: str, payload: dict, db=Depends(get_database), user=Depends(get_current_user)):
    if user.get("role") != Role.STUDENT.value:
        raise HTTPException(status_code=403, detail="Only students can submit tests.")
    student_id = user.get("sub")
    answers = payload.get("answers") if isinstance(payload, dict) else {}
    submission = await student_service.submit_student_test(db, student_id, test_id, answers or {})
    if submission is None:
        raise HTTPException(status_code=404, detail="Test not found or not assigned.")
    return submission


@router.get("/student/tests/debug")
async def debug_student_tests(db=Depends(get_database), user=Depends(get_current_user)):
    """
    Dev-only helper to diagnose why student tests list is empty.
    Mirrors the matching logic used by `get_tests_for_student`.
    """
    if user.get("role") != Role.STUDENT.value:
        raise HTTPException(status_code=403, detail="Only students can access their tests.")

    student_id = user.get("sub")

    def _id_variants(raw_id: str) -> list:
        raw = str(raw_id).strip()
        if not raw:
            return []
        variants = [raw]
        if ObjectId.is_valid(raw):
            variants.append(ObjectId(raw))
        return variants

    def _norm(value: str) -> str:
        return str(value or "").strip().lower()

    student_id_text = str(student_id).strip()
    enrollments = await db["enrollments"].find(
        {"student_id": student_id_text},
        {"course_id": 1, "tenant_id": 1, "created_at": 1},
    ).to_list(500)

    live_classes = await db["live_classes"].find(
        {},
        {"attendee_ids": 1, "course_id": 1, "class_name": 1, "subject": 1, "tenant_id": 1, "start_at": 1},
    ).to_list(500)
    live_classes = [lc for lc in live_classes if student_id_text in [str(x) for x in (lc.get("attendee_ids") or [])]]

    course_id_variants: list = []
    seen_course_variants: set[str] = set()
    class_name_values: set[str] = set()
    subject_values: set[str] = set()
    enrolled_course_ids_raw: list[str] = []

    for enr in enrollments:
        cid_raw = str(enr.get("course_id") or "").strip()
        if not cid_raw:
            continue
        enrolled_course_ids_raw.append(cid_raw)
        for variant in _id_variants(cid_raw):
            key = str(variant)
            if key in seen_course_variants:
                continue
            seen_course_variants.add(key)
            course_id_variants.append(variant)
        if not ObjectId.is_valid(cid_raw):
            subject_values.add(cid_raw)

    for lc in live_classes:
        cid_raw = str(lc.get("course_id") or "").strip()
        if cid_raw:
            for variant in _id_variants(cid_raw):
                key = str(variant)
                if key in seen_course_variants:
                    continue
                seen_course_variants.add(key)
                course_id_variants.append(variant)
        cname = str(lc.get("class_name") or "").strip()
        if cname:
            class_name_values.add(cname)
        subj = str(lc.get("subject") or "").strip()
        if subj:
            subject_values.add(subj)

    # NOTE: This backend may not support operators like `$in` / `$or`.
    # We will fetch published tests and filter locally.
    or_clauses = {"course_id_variants": course_id_variants, "class_names": list(class_name_values), "subjects": list(subject_values)}

    tests_any_count = 0
    tests_published_count = 0
    tests_found_sample: list[dict] = []
    tests_any_sample: list[dict] = []

    class_name_values_lc = {_norm(x) for x in class_name_values}
    subject_values_lc = {_norm(x) for x in subject_values}

    cursor_any = db["tests"].find({})
    async for doc in cursor_any:
        tests_any_count += 1
        if len(tests_any_sample) < 10:
            tests_any_sample.append(
                {
                    "_id": str(doc.get("_id")),
                    "title": doc.get("title"),
                    "course_id": doc.get("course_id"),
                    "class_name": doc.get("class_name"),
                    "subject": doc.get("subject"),
                    "is_published": doc.get("is_published"),
                }
            )

    cursor_pub = db["tests"].find({"is_published": True}).sort("created_at", -1)
    async for doc in cursor_pub:
        course_id_text = str(doc.get("course_id") or "").strip()
        class_name_text = _norm(doc.get("class_name") or "")
        subject_text = _norm(doc.get("subject") or "")
        if (
            (course_id_text and course_id_text in seen_course_variants)
            or (class_name_text and class_name_text in class_name_values_lc)
            or (subject_text and subject_text in subject_values_lc)
        ):
            tests_published_count += 1
            if len(tests_found_sample) < 10:
                tests_found_sample.append(
                    {
                        "_id": str(doc.get("_id")),
                        "title": doc.get("title"),
                        "course_id": doc.get("course_id"),
                        "class_name": doc.get("class_name"),
                        "subject": doc.get("subject"),
                        "is_published": doc.get("is_published"),
                    }
                )

    return {
        "student_id": student_id,
        "enrollments_count": len(enrollments),
        "live_classes_count": len(live_classes),
        "enrolled_course_ids_raw": enrolled_course_ids_raw,
        "course_id_variants_used": [str(x) for x in course_id_variants[:50]],
        "class_name_values": sorted(list(class_name_values))[:50],
        "subject_values": sorted(list(subject_values))[:50],
        "or_clauses": or_clauses,
        "tests_any_count": tests_any_count,
        "tests_published_count": tests_published_count,
        "tests_found_sample": tests_found_sample,
        "tests_any_sample": tests_any_sample,
        "norm_preview": {
            "class_name_values_lc": sorted({_norm(x) for x in class_name_values})[:50],
            "subject_values_lc": sorted({_norm(x) for x in subject_values})[:50],
        },
    }
