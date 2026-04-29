# services/student.py
from bson import ObjectId
from datetime import datetime
from app.services.realtime import ws_manager

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

    # Decorate tests with this student's latest attempt so refresh keeps completed state.
    if tests:
        test_id_set = {str(t.get("_id")) for t in tests if t.get("_id")}
        latest_attempt_by_test = {}
        attempts_cursor = db["test_attempts"].find({"student_id": student_id_text}).sort("submitted_at", -1)
        async for attempt in attempts_cursor:
            tid = str(attempt.get("test_id") or "").strip()
            if not tid or tid not in test_id_set or tid in latest_attempt_by_test:
                continue
            latest_attempt_by_test[tid] = attempt

        for test in tests:
            tid = str(test.get("_id") or "").strip()
            attempt = latest_attempt_by_test.get(tid)
            if not attempt:
                continue
            score = int(attempt.get("score") or 0)
            total = int(attempt.get("total") or 0)
            test["status"] = "completed"
            test["score"] = score
            test["max_score"] = total
            test["submitted_at"] = attempt.get("submitted_at")

    return tests


async def get_test_questions_for_student(db, student_id, test_id):
    tests = await get_tests_for_student(db, student_id)
    allowed_ids = {str(t.get("_id")) for t in tests if t.get("_id")}
    if str(test_id) not in allowed_ids:
        return None

    questions = []
    cursor = db["questions"].find({"test_id": str(test_id)}).sort("order", 1)
    async for doc in cursor:
        questions.append(
            {
                "_id": str(doc.get("_id")),
                "question": doc.get("question") or "",
                "options": doc.get("options") or [],
                "points": int(doc.get("points") or 1),
                "question_type": doc.get("question_type") or "multiple-choice",
            }
        )
    return questions


async def submit_student_test(db, student_id, test_id, answers):
    student_id_text = str(student_id).strip()
    test_id_text = str(test_id).strip()
    if not student_id_text or not test_id_text:
        raise ValueError("Invalid test submission payload")

    tests = await get_tests_for_student(db, student_id_text)
    test_doc = next((t for t in tests if str(t.get("_id")) == test_id_text), None)
    if not test_doc:
        return None

    questions = await db["questions"].find({"test_id": test_id_text}).to_list(None)
    score = 0
    total_points = 0
    for q in questions:
        qid = str(q.get("_id"))
        points = int(q.get("points") or 1)
        total_points += points
        if str((answers or {}).get(qid, "")).strip() == str(q.get("correct_answer", "")).strip():
            score += points

    max_score = total_points if total_points > 0 else len(questions)
    percentage = round((score / max_score) * 100, 2) if max_score > 0 else 0.0

    now = datetime.utcnow()
    attempt = {
        "test_id": test_id_text,
        "student_id": student_id_text,
        "answers": answers or {},
        "score": score,
        "total": max_score,
        "submitted_at": now,
    }
    result = await db["test_attempts"].insert_one(attempt)
    attempt_id = str(result.inserted_id)

    tenant_id = test_doc.get("tenant_id")
    created_by = str(test_doc.get("created_by") or "").strip()

    student_message = f"Your result for {test_doc.get('title', 'test')} is {score}/{max_score} ({percentage}%)."
    student_notification = {
        "tenant_id": tenant_id,
        "user_id": student_id_text,
        "title": "Test submitted",
        "message": student_message,
        "type": "assessment",
        "meta": {"test_id": test_id_text, "attempt_id": attempt_id, "score": score, "total": max_score},
        "read": False,
        "created_at": now,
        "updated_at": now,
    }
    await db["notifications"].insert_one(student_notification)
    await ws_manager.broadcast(f"user:{student_id_text}", {"type": "notification.created", "data": student_notification})

    admin_roles = {"admin", "sub_admin"}
    admin_query = {"role": {"$in": list(admin_roles)}}
    if tenant_id:
        admin_query["tenant_id"] = tenant_id
    admin_users = await db["users"].find(admin_query, {"_id": 1}).to_list(200)
    admin_ids = [str(u.get("_id")) for u in admin_users if u.get("_id")]
    for admin_id in admin_ids:
        notification = {
            "tenant_id": tenant_id,
            "user_id": admin_id,
            "title": "New test submission",
            "message": f"Student submitted {test_doc.get('title', 'a test')}: {score}/{max_score} ({percentage}%).",
            "type": "assessment",
            "meta": {"test_id": test_id_text, "attempt_id": attempt_id, "student_id": student_id_text},
            "read": False,
            "created_at": now,
            "updated_at": now,
        }
        await db["notifications"].insert_one(notification)
        await ws_manager.broadcast(f"user:{admin_id}", {"type": "notification.created", "data": notification})

    # Notify instructor only if this test was created by an instructor account.
    if created_by:
        creator = await db["users"].find_one({"_id": ObjectId(created_by)} if ObjectId.is_valid(created_by) else {"_id": created_by})
        creator_role = str((creator or {}).get("role") or "").lower()
        if creator_role == "instructor":
            instructor_notification = {
                "tenant_id": tenant_id,
                "user_id": created_by,
                "title": "Student submitted your test",
                "message": f"A student submitted {test_doc.get('title', 'your test')}: {score}/{max_score} ({percentage}%).",
                "type": "assessment",
                "meta": {"test_id": test_id_text, "attempt_id": attempt_id, "student_id": student_id_text},
                "read": False,
                "created_at": now,
                "updated_at": now,
            }
            await db["notifications"].insert_one(instructor_notification)
            await ws_manager.broadcast(f"user:{created_by}", {"type": "notification.created", "data": instructor_notification})

    if tenant_id:
        await ws_manager.broadcast(f"tenant:{tenant_id}", {"type": "test_attempt.submitted", "data": {"test_id": test_id_text, "attempt_id": attempt_id}})

    return {
        "attempt_id": attempt_id,
        "score": score,
        "total": max_score,
        "percentage": percentage,
    }
