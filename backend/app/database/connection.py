import logging
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from app.core.config import settings

logger = logging.getLogger(__name__)

Base = declarative_base()

engine_info = {
    "type": "none",
    "connected": False,
    "note": ""
}

def get_engine():
    db_url = settings.DATABASE_URL or ""

    # 1. PostgreSQL (Supabase Cloud Database)
    if db_url.startswith("postgresql://") or db_url.startswith("postgres://"):
        if db_url.startswith("postgres://"):
            db_url = db_url.replace("postgres://", "postgresql://", 1)
        try:
            logger.info("Attempting connection to PostgreSQL (Supabase) database...")
            engine = create_engine(
                db_url,
                pool_pre_ping=True,
                pool_recycle=300
            )
            with engine.connect() as conn:
                logger.info("Successfully connected to PostgreSQL (Supabase) database!")
            engine_info["type"] = "PostgreSQL (Supabase)"
            engine_info["connected"] = True
            engine_info["note"] = "Connected to Supabase cloud database"
            return engine
        except Exception as e:
            logger.warning(f"PostgreSQL connection failed ({e}). Checking for fallback...")
            engine_info["note"] = f"PostgreSQL error: {str(e)[:150]}"
            if not settings.SQLITE_FALLBACK:
                raise e

    # 2. Attempt connecting to MySQL
    elif db_url.startswith("mysql"):
        try:
            logger.info("Attempting connection to MySQL database...")
            engine = create_engine(
                db_url,
                pool_pre_ping=True,
                pool_recycle=3600,
                connect_args={"connect_timeout": 3}
            )
            with engine.connect() as conn:
                logger.info("Successfully connected to MySQL database!")
            engine_info["type"] = "MySQL"
            engine_info["connected"] = True
            engine_info["note"] = "Connected to MySQL database"
            return engine
        except Exception as e:
            logger.warning(f"MySQL connection failed ({e}). Checking for fallback...")
            engine_info["note"] = f"MySQL error: {str(e)[:150]}"
            if not settings.SQLITE_FALLBACK:
                raise e

    # 3. SQLite Fallback (Local Development & Offline Testing)
    logger.info(f"Using SQLite database ({settings.SQLITE_URL}) for reliable execution.")
    engine_info["type"] = "SQLite"
    engine_info["connected"] = True
    if not engine_info["note"]:
        engine_info["note"] = "Using SQLite for standalone execution"
    return create_engine(
        settings.SQLITE_URL,
        connect_args={"check_same_thread": False}
    )

engine = get_engine()
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def init_db():
    from app import models  # noqa
    Base.metadata.create_all(bind=engine)

# Auto-initialize database tables and seed data
try:
    init_db()
    from app.database.seed import seed_database
    seed_database()
except Exception as e:
    logger.warning(f"Initial DB create warning: {e}")

_db_initialized = False

def get_db():
    global _db_initialized
    if not _db_initialized:
        try:
            init_db()
            from app.database.seed import seed_database
            seed_database()
        except Exception as e:
            logger.warning(f"Lazy DB init note: {e}")
        _db_initialized = True

    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
