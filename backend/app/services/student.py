# services/instructor.py (extension)
from bson import ObjectId

async def get_tests_for_student(db, student_id):
    # Return published tests only for courses/classes where student is enrolled.
    # Enrollment sources:
    # - `enrollments` (course enroll/purchase)
    # - `live_classes.attendee_ids` (live class attendance)
    def _id_variants(raw_id: str) -> list:
        raw = str(raw_id).strip()
        if not raw:
            return []
        variants = [raw]
        if ObjectId.is_valid(raw):
            variants.append(ObjectId(raw))
        return variants

    student_id_text = str(student_id).strip()
    if not student_id_text:
        return []

    # IMPORTANT: Some Mongo-compatible backends may not support operators like
    # `$in` / `$or`. Keep queries operator-free and do filtering in Python.
    enrollments = await db["enrollments"].find({"student_id": student_id_text}, {"course_id": 1}).to_list(500)
    live_classes = await db["live_classes"].find({}, {"attendee_ids": 1, "course_id": 1, "class_name": 1, "subject": 1}).to_list(500)
    live_classes = [lc for lc in live_classes if student_id_text in [str(x) for x in (lc.get("attendee_ids") or [])]]
    if not enrollments and not live_classes:
        return []

    course_id_variants: list = []
    class_name_values: set[str] = set()
    subject_values: set[str] = set()
    seen_course_variants: set[str] = set()

    def _norm(value: str) -> str:
        return str(value or "").strip().lower()

    # From enrollments: course_id might be ObjectId string or label like "Maths".
    for enr in enrollments:
        cid_raw = str(enr.get("course_id") or "").strip()
        if not cid_raw:
            continue
        for variant in _id_variants(cid_raw):
            key = str(variant)
            if key in seen_course_variants:
                continue
            seen_course_variants.add(key)
            course_id_variants.append(variant)
        # Also treat label values as subject candidates.
        if not ObjectId.is_valid(cid_raw):
            subject_values.add(cid_raw)

    for live_class in live_classes:
        course_id = str(live_class.get("course_id") or "").strip()
        if course_id:
            for variant in _id_variants(course_id):
                key = str(variant)
                if key in seen_course_variants:
                    continue
                seen_course_variants.add(key)
                course_id_variants.append(variant)

        class_name = str(live_class.get("class_name") or "").strip()
        if class_name:
            class_name_values.add(class_name)

        subject = str(live_class.get("subject") or "").strip()
        if subject:
            subject_values.add(subject)

    tests = []
    # Fetch published tests and filter locally (operator-free backend compatibility).
    cursor = db["tests"].find({"is_published": True}).sort("created_at", -1)
    class_name_values_lc = {_norm(x) for x in class_name_values}
    subject_values_lc = {_norm(x) for x in subject_values}
    async for doc in cursor:
        doc["_id"] = str(doc["_id"])
        course_id_text = str(doc.get("course_id") or "").strip()
        class_name_text = _norm(doc.get("class_name") or "")
        subject_text = _norm(doc.get("subject") or "")
        if (
            (course_id_text and course_id_text in seen_course_variants)
            or (class_name_text and class_name_text in class_name_values_lc)
            or (subject_text and subject_text in subject_values_lc)
        ):
            tests.append(doc)
    return tests
