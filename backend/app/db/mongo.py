from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase
from app.core.config import settings
import logging

client: AsyncIOMotorClient | None = None
db: AsyncIOMotorDatabase | None = None
logger = logging.getLogger("lms-api.mongo")


async def connect_db():
    global client, db
    print("🔥 CONNECTING TO DB...")
    client = AsyncIOMotorClient(settings.mongo_uri)
    db = client[settings.mongo_db]
    print("✅ DB CONNECTED")


async def close_db() -> None:
    if client:
        client.close()


async def ensure_indexes() -> None:
    if db is None:
        return
    async def _create_index(collection, keys, **kwargs):
        try:
            await collection.create_index(keys, **kwargs)
        except Exception as exc:  # noqa: BLE001
            logger.warning("index_creation_failed keys=%s error=%s", keys, exc)

    await _create_index(db.users, [("email", 1)], unique=True)
    await _create_index(db.users, [("tenant_id", 1), ("role", 1)])
    await _create_index(db.courses, [("tenant_id", 1), ("created_at", -1)])
    await _create_index(db.live_classes, [("tenant_id", 1), ("start_at", 1)])
    await _create_index(db.live_classes, [("attendee_ids", 1), ("start_at", 1)])
    await _create_index(db.enrollments, [("tenant_id", 1), ("student_id", 1)])
    await _create_index(db.enrollments, [("student_id", 1), ("course_id", 1), ("tenant_id", 1)])
    await _create_index(db.tests, [("course_id", 1), ("is_published", 1), ("created_at", -1)])
    await _create_index(db.tests, [("created_by", 1), ("created_at", -1)])
    await _create_index(db.test_attempts, [("student_id", 1)])
    await _create_index(db.test_attempts, [("test_id", 1)])
    await _create_index(db.ratings, [("target_type", 1), ("target_id", 1), ("tenant_id", 1)])
    await _create_index(db.payments, [("tenant_id", 1), ("created_at", -1)])
    # Keep non-unique for compatibility with legacy duplicated local order ids.
    await _create_index(db.payments, [("order_id", 1)])
    await _create_index(db.notifications, [("user_id", 1), ("created_at", -1)])
    await _create_index(db.notifications, [("tenant_id", 1), ("read", 1)])


# ✅ ADD THIS
async def get_database():
    global db
    if db is None:
        await connect_db()
    if db is None:
        raise Exception("Database not initialized. connect_db() not called")
    return db