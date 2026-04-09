from datetime import datetime
from bson import ObjectId


# CREATE
async def create_course(db, data, instructor_id):
    course = {
        "title": data.title,
        "description": data.description,
        "price": data.price,
        "instructor_id": str(instructor_id),
        "created_at": datetime.utcnow()
    }

    result = await db["courses"].insert_one(course)
    course["_id"] = str(result.inserted_id)

    return course


# GET ALL
async def get_courses(db, instructor_id):
    courses = []
    cursor = db["courses"].find({"instructor_id": str(instructor_id)})

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
    test = {
        "title": data.title,
        "course_id": data.course_id,
        "duration": data.duration,
        "total_questions": data.total_questions,
        "scheduled_at": data.scheduled_at,
        "is_published": False,
        "created_by": str(instructor_id),
        "created_at": datetime.utcnow()
    }

    result = await db["tests"].insert_one(test)
    test["_id"] = str(result.inserted_id)

    return test


# GET TESTS
async def get_tests(db, instructor_id):
    tests = []
    cursor = db["tests"].find({"created_by": str(instructor_id)})

    async for doc in cursor:
        doc["_id"] = str(doc["_id"])
        tests.append(doc)

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

async def get_student_insights(db, instructor_id):
    # 🔥 Get all courses of instructor
    courses = await db["courses"].find({
        "instructor_id": str(instructor_id)
    }).to_list(None)

    course_ids = [str(c["_id"]) for c in courses]

    # 🔥 Get enrolled students
    enrollments = await db["enrollments"].find({
        "course_id": {"$in": course_ids}
    }).to_list(None)

    student_ids = list(set(e["student_id"] for e in enrollments))

    # 🔥 Get test attempts
    attempts = await db["test_attempts"].find({
        "student_id": {"$in": student_ids}
    }).to_list(None)

    # 🧠 Calculate performance
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