from contextlib import asynccontextmanager
from fastapi import FastAPI
from starlette.middleware.base import BaseHTTPMiddleware
from fastapi.middleware.cors import CORSMiddleware
import logging
import time
import uuid
from app.core.config import settings
from app.db.mongo import connect_db, close_db, ensure_indexes
from app.routers.auth import router as auth_router
from app.routers.lms import router as lms_router
from app.routers.ws import router as ws_router
from app.routers import instructor

@asynccontextmanager
async def lifespan(_: FastAPI):
    await connect_db()
    await ensure_indexes()
    yield
    await close_db()


app = FastAPI(title=settings.app_name, lifespan=lifespan)
logger = logging.getLogger("lms-api")
logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(name)s %(message)s")


class RequestLoggingMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request, call_next):
        request_id = str(uuid.uuid4())
        started = time.time()
        response = await call_next(request)
        elapsed_ms = int((time.time() - started) * 1000)
        response.headers["X-Request-Id"] = request_id
        logger.info(
            "request_id=%s method=%s path=%s status=%s elapsed_ms=%s",
            request_id,
            request.method,
            request.url.path,
            response.status_code,
            elapsed_ms,
        )
        return response


app.add_middleware(RequestLoggingMiddleware)

app.add_middleware(
    CORSMiddleware,
    # allow_origins=[x.strip() for x in settings.cors_origins.split(",") if x.strip()],
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
async def health():
    return {"ok": True}


app.include_router(auth_router, prefix=settings.api_prefix)
app.include_router(lms_router, prefix=settings.api_prefix)
app.include_router(ws_router)
app.include_router(instructor.router, prefix=settings.api_prefix)