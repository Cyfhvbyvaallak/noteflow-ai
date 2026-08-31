import os
import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from app.core.config import settings
from app.database.connection import init_db
from app.database.seed import seed_database
from app.routes import (
    auth,
    lectures,
    transcription,
    ai,
    notes,
    quizzes,
    dashboard,
    search,
    settings as settings_routes
)

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger("noteflow_ai")

app = FastAPI(
    title="NoteFlow AI — Intelligent Speech-to-Study Automation Platform",
    description="Full-stack AI lecture transcription, automated summarization, revision generation, and quiz automation API.",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origin_list or ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Ensure uploads directory exists and mount static files
os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=settings.UPLOAD_DIR), name="uploads")

# Include Routers
app.include_router(auth.router)
app.include_router(lectures.router)
app.include_router(transcription.router)
app.include_router(ai.router)
app.include_router(notes.router)
app.include_router(quizzes.router)
app.include_router(dashboard.router)
app.include_router(search.router)
app.include_router(settings_routes.router)

@app.on_event("startup")
def on_startup():
    logger.info("Initializing NoteFlow AI database and verifying sample records...")
    try:
        init_db()
        seed_database()
        logger.info("NoteFlow AI backend startup complete!")
    except Exception as e:
        logger.error(f"Startup initialization error: {e}")

@app.get("/")
def root():
    return {
        "app": "NoteFlow AI — Intelligent Speech-to-Study Automation Platform",
        "version": "1.0.0",
        "status": "online",
        "documentation": "/docs"
    }

@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "service": "noteflow-api",
        "environment": settings.ENVIRONMENT
    }
