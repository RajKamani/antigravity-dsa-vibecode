from fastapi import FastAPI, Request, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from beanie import init_beanie
from collections import defaultdict
import logging
import time

from api.core.config import settings
from api.models.user import User
from api.models.problem import Problem
from api.routers import auth, problems, extension, stats

app = FastAPI(title=settings.PROJECT_NAME)

# CORS — parse origins from config
origins = (
    ["*"] if settings.CORS_ORIGINS == "*"
    else [o.strip() for o in settings.CORS_ORIGINS.split(",")]
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Simple in-memory rate limiter for auth endpoints
_rate_limits: dict[str, list[float]] = defaultdict(list)
RATE_LIMIT_WINDOW = 60  # seconds
RATE_LIMIT_MAX = 10     # max attempts per window

@app.middleware("http")
async def rate_limit_auth(request: Request, call_next):
    if request.url.path.startswith("/api/auth/"):
        client_ip = request.client.host if request.client else "unknown"
        now = time.time()
        # Prune old entries
        _rate_limits[client_ip] = [
            t for t in _rate_limits[client_ip] if now - t < RATE_LIMIT_WINDOW
        ]
        if len(_rate_limits[client_ip]) >= RATE_LIMIT_MAX:
            raise HTTPException(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                detail="Too many requests. Try again later.",
            )
        _rate_limits[client_ip].append(now)
    return await call_next(request)

@app.on_event("startup")
async def startup_db_client():
    try:
        app.mongodb_client = AsyncIOMotorClient(settings.MONGODB_URI)
        app.mongodb = app.mongodb_client[settings.DATABASE_NAME]
        await init_beanie(database=app.mongodb, document_models=[User, Problem])
        logging.info("Connected to MongoDB successfully!")
    except Exception as e:
        logging.error(f"Failed to connect to MongoDB: {e}")

@app.on_event("shutdown")
async def shutdown_db_client():
    app.mongodb_client.close()

app.include_router(auth.router, prefix="/api")
app.include_router(problems.router, prefix="/api")
app.include_router(extension.router, prefix="/api")
app.include_router(stats.router, prefix="/api")

@app.get("/api/health")
async def health_check():
    return {"status": "ok"}

