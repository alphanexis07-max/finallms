from datetime import datetime, timezone
from bson import ObjectId
from fastapi import HTTPException


def _dump_model(data):
    if hasattr(data, "model_dump"):
        return data.model_dump()
    return data.dict()


def _object_id_or_400(value: str, field_name: str = "id"):
    if not ObjectId.is_valid(value):
        raise HTTPException(status_code=400, detail=f"Invalid {field_name}")
    return ObjectId(value)


def _derive_test_status(item, now=None):
    def _to_utc(dt):
        if not dt:
            return None
        if dt.tzinfo is None:
            # Treat naive timestamps as UTC for compatibility with existing records.
            return dt.replace(tzinfo=timezone.utc)
        return dt.astimezone(timezone.utc)

    now_utc = _to_utc(now) if now else datetime.now(timezone.utc)
    if not item.get("is_published"):
        return "draft"
    scheduled_at = _to_utc(item.get("scheduled_at"))
    deadline_at = _to_utc(item.get("deadline_at"))
    if scheduled_at and scheduled_at > now_utc:
        return "scheduled"
    if deadline_at and deadline_at < now_utc:
        return "closed"
    return "active"


# CREATE
async def create_course(db, data, instructor_id):
    course = {
        "title": data.title,
        "description": data.description,
        "price": data.price,
        "instructor_id": str(instructor_id),
        "created_at": datetime.utcnow(),
    }

    result = await db["courses"].insert_one(course)
    course["_id"] = str(result.inserted_id)

    return course


# GET ALL
async def get_courses(db, instructor_id):
    courses = []
    cursor = db["courses"].find(
        {
            "$or": [
                {"instructor_id": str(instructor_id)},
                {"created_by": str(instructor_id)},
            ]
        }
    )

    async for doc in cursor:
        doc["_id"] = str(doc["_id"])
        courses.append(doc)

    return courses


# UPDATE
async def update_course(db, course_id, data, instructor_id):
    update_data = {k: v for k, v in _dump_model(data).items() if v is not None}

    await db["courses"].update_one(
        {"_id": ObjectId(course_id), "instructor_id": str(instructor_id)},
        {"$set": update_data},
    )

    return {"message": "Course updated"}


# DELETE
async def delete_course(db, course_id, instructor_id):
    await db["courses"].delete_one(
        {"_id": ObjectId(course_id), "instructor_id": str(instructor_id)}
    )

    return {"message": "Course deleted"}


# GET ASSIGNED CLASSES
async def get_classes(db, instructor_id, status=None):
    query = {"instructor_id": str(instructor_id)}

    if status:
        query["status"] = status

    classes = []
    cursor = db["classes"].find(query)

    async for doc in cursor:
        doc["_id"] = str(doc["_id"])

        now = datetime.utcnow()
        if doc.get("start_time") and doc.get("end_time"):
            if doc["start_time"] <= now <= doc["end_time"]:
                doc["status"] = "live"
            elif now > doc["end_time"]:
                doc["status"] = "completed"

        classes.append(doc)

    return classes


# CREATE TEST
async def create_test(db, data, instructor_id):
    course_oid = _object_id_or_400(data.course_id, "course_id")
    course = await db["courses"].find_one(
        {
            "_id": course_oid,
            "$or": [
                {"instructor_id": str(instructor_id)},
                {"created_by": str(instructor_id)},
            ],
        }
    )
    if not course:
        raise HTTPException(status_code=404, detail="Course not found for this instructor")

    now = datetime.utcnow()
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
        "is_published": data.is_published,
        "created_by": str(instructor_id),
        "created_at": now,
        "updated_at": now,
    }

    result = await db["tests"].insert_one(test)
    test["_id"] = str(result.inserted_id)
    test["status"] = _derive_test_status(test, now)
    test["attempts_count"] = 0
    test["average_score"] = 0

    return test


# GET TESTS
async def get_tests(db, instructor_id):
    tests = []
    now = datetime.utcnow()
    cursor = db["tests"].find({"created_by": str(instructor_id)}).sort("created_at", -1)

    async for doc in cursor:
        doc["_id"] = str(doc["_id"])
        test_id = doc["_id"]

        question_count = await db["questions"].count_documents({"test_id": test_id})
        attempts = await db["test_attempts"].find({"test_id": test_id}).to_list(None)
        attempts_count = len(attempts)

        avg_score_pct = 0
        if attempts_count > 0:
            percentages = [
                (a.get("score", 0) / a.get("total", 1)) * 100
                for a in attempts
                if a.get("total", 0) > 0
            ]
            if percentages:
                avg_score_pct = round(sum(percentages) / len(percentages), 2)

        doc["total_questions"] = question_count if question_count > 0 else doc.get("total_questions", 0)
        doc["attempts_count"] = attempts_count
        doc["average_score"] = avg_score_pct
        doc["status"] = _derive_test_status(doc, now)
        tests.append(doc)

    return tests


async def get_test_by_id(db, test_id, instructor_id):
    oid = _object_id_or_400(test_id, "test_id")
    doc = await db["tests"].find_one({"_id": oid, "created_by": str(instructor_id)})
    if not doc:
        raise HTTPException(status_code=404, detail="Test not found")
    doc["_id"] = str(doc["_id"])
    doc["questions"] = await get_questions(db, doc["_id"])
    doc["status"] = _derive_test_status(doc)
    return doc


# UPDATE TEST
async def update_test(db, test_id, data, instructor_id):
    oid = _object_id_or_400(test_id, "test_id")
    update_data = {k: v for k, v in _dump_model(data).items() if v is not None}
    if "course_id" in update_data:
        course_oid = _object_id_or_400(update_data["course_id"], "course_id")
        course = await db["courses"].find_one(
            {
                "_id": course_oid,
                "$or": [
                    {"instructor_id": str(instructor_id)},
                    {"created_by": str(instructor_id)},
                ],
            }
        )
        if not course:
            raise HTTPException(status_code=404, detail="Course not found for this instructor")

    update_data["updated_at"] = datetime.utcnow()

    await db["tests"].update_one(
        {"_id": oid, "created_by": str(instructor_id)},
        {"$set": update_data},
    )

    return {"message": "Test updated"}


async def delete_test(db, test_id, instructor_id):
    oid = _object_id_or_400(test_id, "test_id")
    test = await db["tests"].find_one({"_id": oid, "created_by": str(instructor_id)})
    if not test:
        raise HTTPException(status_code=404, detail="Test not found")

    test_id_str = str(oid)
    await db["questions"].delete_many({"test_id": test_id_str})
    await db["test_attempts"].delete_many({"test_id": test_id_str})
    await db["tests"].delete_one({"_id": oid, "created_by": str(instructor_id)})
    return {"message": "Test deleted"}


# ADD QUESTION
async def add_question(db, data, instructor_id):
    test_oid = _object_id_or_400(data.test_id, "test_id")
    test = await db["tests"].find_one({"_id": test_oid, "created_by": str(instructor_id)})
    if not test:
        raise HTTPException(status_code=404, detail="Test not found")

    question = {
        "test_id": data.test_id,
        "question": data.question,
        "options": data.options,
        "correct_answer": data.correct_answer,
        "points": data.points,
        "question_type": data.question_type,
        "order": data.order,
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow(),
    }

    result = await db["questions"].insert_one(question)
    question["_id"] = str(result.inserted_id)

    await db["tests"].update_one(
        {"_id": test_oid, "created_by": str(instructor_id)},
        {"$inc": {"total_questions": 1}, "$set": {"updated_at": datetime.utcnow()}},
    )

    return question


# GET QUESTIONS
async def get_questions(db, test_id):
    questions = []
    cursor = db["questions"].find({"test_id": test_id}).sort("order", 1)

    async for doc in cursor:
        doc["_id"] = str(doc["_id"])
        questions.append(doc)

    return questions


async def update_question(db, question_id, data, instructor_id):
    qid = _object_id_or_400(question_id, "question_id")
    question = await db["questions"].find_one({"_id": qid})
    if not question:
        raise HTTPException(status_code=404, detail="Question not found")

    test_oid = _object_id_or_400(question.get("test_id"), "test_id")
    test = await db["tests"].find_one({"_id": test_oid, "created_by": str(instructor_id)})
    if not test:
        raise HTTPException(status_code=403, detail="Forbidden")

    updates = {k: v for k, v in _dump_model(data).items() if v is not None}
    if not updates:
        return {"message": "No updates provided"}

    updates["updated_at"] = datetime.utcnow()
    await db["questions"].update_one({"_id": qid}, {"$set": updates})
    return {"message": "Question updated"}


async def delete_question(db, question_id, instructor_id):
    qid = _object_id_or_400(question_id, "question_id")
    question = await db["questions"].find_one({"_id": qid})
    if not question:
        raise HTTPException(status_code=404, detail="Question not found")

    test_id = question.get("test_id")
    test_oid = _object_id_or_400(test_id, "test_id")
    test = await db["tests"].find_one({"_id": test_oid, "created_by": str(instructor_id)})
    if not test:
        raise HTTPException(status_code=403, detail="Forbidden")

    await db["questions"].delete_one({"_id": qid})
    await db["tests"].update_one(
        {"_id": test_oid, "created_by": str(instructor_id)},
        {"$inc": {"total_questions": -1}, "$set": {"updated_at": datetime.utcnow()}},
    )
    return {"message": "Question deleted"}


# SUBMIT TEST
async def submit_test(db, data, student_id):
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
        "submitted_at": datetime.utcnow(),
    }

    await db["test_attempts"].insert_one(attempt)

    return {
        "score": score,
        "total": len(questions),
    }


async def get_test_analytics(db, test_id):
    attempts = await db["test_attempts"].find({"test_id": test_id}).to_list(None)

    total_students = len(attempts)
    avg_score = 0

    if total_students > 0:
        avg_score = sum(a["score"] for a in attempts) / total_students

    return {
        "total_attempts": total_students,
        "average_score": avg_score,
    }


async def get_weekly_test_overview(db, instructor_id):
    tests = await get_tests(db, instructor_id)
    total_tests = len(tests)
    published_tests = len([t for t in tests if t.get("is_published")])
    total_attempts = sum(int(t.get("attempts_count", 0)) for t in tests)

    avg_score = 0
    avg_values = [float(t.get("average_score", 0)) for t in tests if float(t.get("average_score", 0)) > 0]
    if avg_values:
        avg_score = round(sum(avg_values) / len(avg_values), 2)

    return {
        "total_tests": total_tests,
        "published_tests": published_tests,
        "draft_or_scheduled_tests": max(total_tests - published_tests, 0),
        "total_attempts": total_attempts,
        "average_score": avg_score,
    }


async def get_dashboard(db, instructor_id):
    try:
        if db is None:
            return {
                "live_sessions": 0,
                "upcoming_classes": 0,
                "tests": 0,
                "courses": 0,
                "labs": 0,
                "events": 0,
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
            "events": 0,
        }

    except Exception as e:
        print("DASHBOARD ERROR:", e)
        return {
            "live_sessions": 0,
            "upcoming_classes": 0,
            "tests": 0,
            "courses": 0,
            "labs": 0,
            "events": 0,
        }


async def get_student_insights(db, instructor_id):
    courses = await db["courses"].find({
        "instructor_id": str(instructor_id)
    }).to_list(None)

    course_ids = [str(c["_id"]) for c in courses]

    enrollments = await db["enrollments"].find({
        "course_id": {"$in": course_ids}
    }).to_list(None)

    student_ids = list(set(e["student_id"] for e in enrollments))

    attempts = await db["test_attempts"].find({
        "student_id": {"$in": student_ids}
    }).to_list(None)

    student_scores = {}

    for a in attempts:
        sid = a["student_id"]

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
            ),
        })

    total_students = len(student_ids)
    top_performers = len([i for i in insights if i["flag"] == "top_performer"])
    needs_support = len([i for i in insights if i["flag"] == "needs_support"])

    return {
        "summary": {
            "total_students": total_students,
            "top_performers": top_performers,
            "needs_support": needs_support,
        },
        "students": insights,
    }
