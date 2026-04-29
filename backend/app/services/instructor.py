from datetime import datetime, timezone
from bson import ObjectId
from app.services.realtime import ws_manager


# CREATE
async def create_course(db, data, instructor_id):
    course = {
        "title": data.title,
        "description": data.description,
        "price": data.price,
        "instructor_id": str(instructor_id),
        "created_by": str(instructor_id),
        "created_at": datetime.utcnow()
    }

    result = await db["courses"].insert_one(course)
    course["_id"] = str(result.inserted_id)

    return course


# GET ALL
async def get_courses(db, instructor_id):
    courses = []
    instructor_key = str(instructor_id)
    cursor = db["courses"].find({
        "$or": [
            {"instructor_id": instructor_key},
            {"created_by": instructor_key},
        ]
    })

    async for doc in cursor:
        doc["_id"] = str(doc["_id"])
        courses.append(doc)

    return courses


# UPDATE
async def update_course(db, course_id, data, instructor_id):
    update_data = {k: v for k, v in data.dict().items() if v is not None}

    await db["courses"].update_one(
        {"_id": ObjectId(course_id), "instructor_id": str(instructor_id)},
        {"$set": update_data}
    )

    return {"message": "Course updated"}


# DELETE
async def delete_course(db, course_id, instructor_id):
    await db["courses"].delete_one(
        {"_id": ObjectId(course_id), "instructor_id": str(instructor_id)}
    )

    return {"message": "Course deleted"}

# services/instructor.py

# GET ASSIGNED CLASSES
async def get_classes(db, instructor_id, status=None):
    query = {"instructor_id": str(instructor_id)}

    if status:
        query["status"] = status

    classes = []
    cursor = db["classes"].find(query)

    async for doc in cursor:
        doc["_id"] = str(doc["_id"])

        # 🔥 Auto status update
        now = datetime.utcnow()
        if doc["start_time"] <= now <= doc["end_time"]:
            doc["status"] = "live"
        elif now > doc["end_time"]:
            doc["status"] = "completed"

        classes.append(doc)

    return classes

# CREATE TEST
async def create_test(db, data, instructor_id):
    # NOTE: Student app relies on `is_published: True` to list tests.
    # The previous implementation hardcoded `is_published` to False, so
    # newly created tests were never visible on the student tests page.
    test = {
        "title": data.title,
        "course_id": data.course_id,
        "duration": data.duration,
        "total_questions": data.total_questions,
        "scheduled_at": data.scheduled_at,
        "description": data.description,
        "class_name": data.class_name,
        "subject": data.subject,
        "deadline_at": data.deadline_at,
        "attempts_allowed": data.attempts_allowed,
        "shuffle_questions": data.shuffle_questions,
        "show_results_instantly": data.show_results_instantly,
        "is_published": bool(data.is_published),
        "created_by": str(instructor_id),
        "created_at": datetime.utcnow(),
    }

    result = await db["tests"].insert_one(test)
    test["_id"] = str(result.inserted_id)

    return test


# GET TESTS
async def get_tests(db, instructor_id):
    tests = []
    owner_id = str(instructor_id)
    cursor = db["tests"].find({"created_by": owner_id})

    async for doc in cursor:
        doc["_id"] = str(doc["_id"])
        tests.append(doc)

    if not tests:
        return []

    # Attach attempts metadata for dashboard cards/highlights.
    test_ids = {str(t["_id"]) for t in tests if t.get("_id")}
    attempts_by_test = {}
    attempts_cursor = db["test_attempts"].find({}).sort("submitted_at", -1)
    async for attempt in attempts_cursor:
        tid = str(attempt.get("test_id") or "").strip()
        if not tid or tid not in test_ids:
            continue
        attempts_by_test.setdefault(tid, []).append(attempt)

    for test in tests:
        tid = str(test.get("_id") or "")
        attempts = attempts_by_test.get(tid, [])
        test["attempts_count"] = len(attempts)
        if attempts:
            avg = sum((float(a.get("score") or 0) / max(float(a.get("total") or 1), 1)) * 100 for a in attempts) / len(attempts)
            test["average_score"] = round(avg, 2)
            latest_attempt = attempts[0]
            test["latest_submission_at"] = latest_attempt.get("submitted_at")
        else:
            test["average_score"] = 0

    return tests


# UPDATE TEST
async def update_test(db, test_id, data, instructor_id):
    from bson import ObjectId

    update_data = {k: v for k, v in data.dict().items() if v is not None}

    await db["tests"].update_one(
        {"_id": ObjectId(test_id), "created_by": str(instructor_id)},
        {"$set": update_data}
    )

    return {"message": "Test updated"}

# ADD QUESTION
async def add_question(db, data):
    question = {
        "test_id": data.test_id,
        "question": data.question,
        "options": data.options,
        "correct_answer": data.correct_answer
    }

    result = await db["questions"].insert_one(question)
    question["_id"] = str(result.inserted_id)

    return question


# GET QUESTIONS
async def get_questions(db, test_id):
    questions = []
    cursor = db["questions"].find({"test_id": test_id})

    async for doc in cursor:
        doc["_id"] = str(doc["_id"])
        questions.append(doc)

    return questions

# SUBMIT TEST
async def submit_test(db, data, student_id):
    from datetime import datetime

    questions = await db["questions"].find({"test_id": data.test_id}).to_list(None)

    score = 0

    for q in questions:
        qid = str(q["_id"])
        if data.answers.get(qid) == q["correct_answer"]:
            score += 1

    attempt = {
        "test_id": data.test_id,
        "student_id": str(student_id),
        "answers": data.answers,
        "score": score,
        "total": len(questions),
        "submitted_at": datetime.utcnow()
    }

    await db["test_attempts"].insert_one(attempt)

    return {
        "score": score,
        "total": len(questions)
    }


async def get_test_analytics(db, test_id):
    attempts = await db["test_attempts"].find({"test_id": test_id}).to_list(None)

    total_students = len(attempts)
    avg_score = 0

    if total_students > 0:
        avg_score = sum(a["score"] for a in attempts) / total_students

    return {
        "total_attempts": total_students,
        "average_score": avg_score
    }


async def get_test_results_for_owner(db, test_id, owner_id, owner_role):
    test = await db["tests"].find_one({"_id": ObjectId(test_id)} if ObjectId.is_valid(test_id) else {"_id": test_id})
    if not test:
        return None

    created_by = str(test.get("created_by") or "")
    if owner_role == "instructor" and created_by != str(owner_id):
        return "forbidden"

    attempts = await db["test_attempts"].find({"test_id": str(test.get("_id"))}).sort("submitted_at", -1).to_list(None)
    user_ids = []
    seen = set()
    for a in attempts:
        sid = str(a.get("student_id") or "").strip()
        if sid and sid not in seen:
            seen.add(sid)
            user_ids.append(sid)

    users = {}
    if user_ids:
        # Cross-backend safe: load users and filter locally.
        users_cursor = db["users"].find({})
        async for u in users_cursor:
            uid = str(u.get("_id"))
            if uid in seen:
                users[uid] = u

    items = []
    for attempt in attempts:
        sid = str(attempt.get("student_id") or "").strip()
        total = int(attempt.get("total") or 0)
        score = int(attempt.get("score") or 0)
        percentage = round((score / total) * 100, 2) if total > 0 else 0
        student = users.get(sid) or {}
        items.append(
            {
                "attempt_id": str(attempt.get("_id")),
                "student_id": sid,
                "student_name": student.get("full_name") or student.get("name") or student.get("email") or "Student",
                "student_email": student.get("email") or "",
                "score": score,
                "total": total,
                "percentage": percentage,
                "submitted_at": attempt.get("submitted_at"),
            }
        )

    return {
        "test_id": str(test.get("_id")),
        "test_title": test.get("title") or "Test",
        "items": items,
    }


async def get_weekly_test_overview(db, instructor_id):
    tests = await db["tests"].find({"created_by": str(instructor_id)}).to_list(None)

    test_ids = [str(test.get("_id")) for test in tests if test.get("_id")]
    attempts = []
    if test_ids:
        test_id_set = set(test_ids)
        attempts_cursor = db["test_attempts"].find({})
        async for attempt in attempts_cursor:
            if str(attempt.get("test_id") or "") in test_id_set:
                attempts.append(attempt)

    published_tests = 0
    draft_or_scheduled_tests = 0

    for test in tests:
        status = str(test.get("status") or "").lower()
        is_published = bool(test.get("is_published"))

        if status in {"active", "closed", "published"} or is_published:
            published_tests += 1
        else:
            draft_or_scheduled_tests += 1

    total_attempts = len(attempts)
    score_sum = 0
    score_count = 0

    for attempt in attempts:
        score = attempt.get("score")
        total = attempt.get("total")
        if total and isinstance(total, (int, float)) and total > 0 and isinstance(score, (int, float)):
            score_sum += (score / total) * 100
            score_count += 1

    average_score = round(score_sum / score_count, 2) if score_count else 0

    return {
        "total_tests": len(tests),
        "published_tests": published_tests,
        "draft_or_scheduled_tests": draft_or_scheduled_tests,
        "total_attempts": total_attempts,
        "average_score": average_score,
    }

# from datetime import datetime


# async def get_dashboard(db, instructor_id):
    now = datetime.utcnow()

    # 🔥 CLASSES
    classes = await db["classes"].find({
        "instructor_id": str(instructor_id)
    }).to_list(None)

    live_sessions = 0
    upcoming_classes = 0

    for c in classes:
        if c["start_time"] <= now <= c["end_time"]:
            live_sessions += 1
        elif now < c["start_time"]:
            upcoming_classes += 1

    # 🔥 TESTS
    tests_count = await db["tests"].count_documents({
        "created_by": str(instructor_id)
    })

    # 🔥 COURSES
    courses_count = await db["courses"].count_documents({
        "instructor_id": str(instructor_id)
    })

    # 🔥 OPTIONAL (for future)
    labs = 0
    events = 0

    return {
        "live_sessions": live_sessions,
        "upcoming_classes": upcoming_classes,
        "tests": tests_count,
        "courses": courses_count,
        "labs": labs,
        "events": events
    }

async def get_dashboard(db, instructor_id):
    from datetime import datetime

    try:
        if db is None:
            return {
                "live_sessions": 0,
                "upcoming_classes": 0,
                "tests": 0,
                "courses": 0,
                "labs": 0,
                "events": 0
            }

        now = datetime.utcnow()

        classes = await db["classes"].find({
            "instructor_id": str(instructor_id)
        }).to_list(None)

        live = 0
        upcoming = 0

        for c in classes:
            start = c.get("start_time")
            end = c.get("end_time")

            if start and end:
                if start <= now <= end:
                    live += 1
                elif now < start:
                    upcoming += 1

        tests = await db["tests"].count_documents({
            "created_by": str(instructor_id)
        })

        courses = await db["courses"].count_documents({
            "instructor_id": str(instructor_id)
        })

        return {
            "live_sessions": live,
            "upcoming_classes": upcoming,
            "tests": tests,
            "courses": courses,
            "labs": 0,
            "events": 0
        }

    except Exception as e:
        print("DASHBOARD ERROR:", e)
        return {
            "live_sessions": 0,
            "upcoming_classes": 0,
            "tests": 0,
            "courses": 0,
            "labs": 0,
            "events": 0
        }


async def upload_certificate(db, instructor_id, tenant_id, payload):
    instructor_variants = _id_variants(instructor_id)
    course_variants = _id_variants(payload.course_id)
    student_variants = _id_variants(payload.student_id)

    if not instructor_variants or not course_variants or not student_variants:
        raise ValueError("Invalid certificate payload")

    course_query = {
        "_id": {"$in": course_variants},
        "$or": [
            {"instructor_id": {"$in": instructor_variants}},
            {"created_by": {"$in": instructor_variants}},
        ],
    }
    if tenant_id:
        course_query["tenant_id"] = tenant_id

    course = await db["courses"].find_one(course_query)
    if not course:
        raise PermissionError("You can upload certificates only for your own courses")

    enrollment_query = {
        "course_id": {"$in": course_variants},
        "student_id": {"$in": student_variants},
    }
    if tenant_id:
        enrollment_query["tenant_id"] = tenant_id

    enrollment = await db["enrollments"].find_one(enrollment_query)
    if not enrollment:
        raise LookupError("Student is not enrolled in this course")

    now = datetime.utcnow()
    cert = {
        "tenant_id": tenant_id,
        "instructor_id": str(instructor_id),
        "student_id": str(payload.student_id),
        "course_id": str(payload.course_id),
        "title": str(payload.title).strip(),
        "file_url": str(payload.file_url or '').strip(),
        "created_at": now,
        "updated_at": now,
    }

    result = await db["certificates"].insert_one(cert)
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
    await db["notifications"].insert_one(notification)
    await ws_manager.broadcast(f"user:{payload.student_id}", {"type": "notification.created", "data": notification})
    if tenant_id:
        await ws_manager.broadcast(f"tenant:{tenant_id}", {"type": "notification.created", "data": notification})

    return cert

def _id_variants(value):
    raw = str(value or "").strip()
    if not raw:
        return []
    variants = [raw]
    if ObjectId.is_valid(raw):
        variants.append(ObjectId(raw))
    return variants


async def get_student_insights(db, instructor_id, tenant_id=None):
    instructor_variants = _id_variants(instructor_id)
    if not instructor_variants:
        return {
            "summary": {
                "total_students": 0,
                "top_performers": 0,
                "needs_support": 0,
            },
            "students": [],
        }

    # Collect all courses effectively taught by this instructor.
    course_ids = set()

    course_or = [{"instructor_id": {"$in": instructor_variants}}, {"created_by": {"$in": instructor_variants}}]
    course_query = {"$or": course_or}
    if tenant_id:
        course_query["tenant_id"] = tenant_id

    courses = await db["courses"].find(course_query).to_list(None)
    for course in courses:
        cid = course.get("_id")
        if cid:
            course_ids.add(str(cid))

    # Also include courses referenced by instructor's live classes.
    live_query = {"instructor_id": {"$in": instructor_variants}}
    if tenant_id:
        live_query["tenant_id"] = tenant_id
    live_classes = await db["live_classes"].find(live_query, {"course_id": 1}).to_list(None)
    for live_class in live_classes:
        course_id = str(live_class.get("course_id") or "").strip()
        if course_id:
            course_ids.add(course_id)

    if not course_ids:
        return {
            "summary": {
                "total_students": 0,
                "top_performers": 0,
                "needs_support": 0,
            },
            "students": [],
        }

    course_id_variants = []
    seen_course_variants = set()
    for course_id in course_ids:
        for variant in _id_variants(course_id):
            key = str(variant)
            if key in seen_course_variants:
                continue
            seen_course_variants.add(key)
            course_id_variants.append(variant)

    enrollment_query = {"course_id": {"$in": course_id_variants}}
    if tenant_id:
        enrollment_query["tenant_id"] = tenant_id

    enrollments = await db["enrollments"].find(enrollment_query).to_list(None)

    student_ids = []
    seen_students = set()
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
    seen_student_variants = set()
    for sid in student_ids:
        for variant in _id_variants(sid):
            key = str(variant)
            if key in seen_student_variants:
                continue
            seen_student_variants.add(key)
            student_id_variants.append(variant)

    attempts = await db["test_attempts"].find({"student_id": {"$in": student_id_variants}}).to_list(None)

    # 🧠 Calculate performance
    student_scores = {}

    for a in attempts:
        sid = str(a.get("student_id") or "").strip()
        if not sid:
            continue

        if sid not in student_scores:
            student_scores[sid] = {"total": 0, "score": 0}

        student_scores[sid]["total"] += a["total"]
        student_scores[sid]["score"] += a["score"]

    insights = []

    for sid in student_ids:
        data = student_scores.get(sid, {"total": 0, "score": 0})

        percentage = 0
        if data["total"] > 0:
            percentage = (data["score"] / data["total"]) * 100

        insights.append({
            "student_id": sid,
            "performance": round(percentage, 2),
            "flag": (
                "top_performer" if percentage >= 80 else
                "needs_support" if percentage < 40 else
                "average"
            )
        })

    # 📊 Summary
    total_students = len(student_ids)
    top_performers = len([i for i in insights if i["flag"] == "top_performer"])
    needs_support = len([i for i in insights if i["flag"] == "needs_support"])

    return {
        "summary": {
            "total_students": total_students,
            "top_performers": top_performers,
            "needs_support": needs_support
        },
        "students": insights
    }