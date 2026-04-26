from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from beanie import init_beanie
import logging

from api.core.config import settings
from api.models.user import User
from api.models.problem import Problem
from api.routers import auth, problems, extension

app = FastAPI(title=settings.PROJECT_NAME)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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

@app.get("/api/health")
async def health_check():
    return {"status": "ok"}
