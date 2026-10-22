import logging
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from app.core.config import settings

logger = logging.getLogger(__name__)

Base = declarative_base()

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
            return engine
        except Exception as e:
            logger.warning(f"PostgreSQL connection failed ({e}). Checking for fallback...")
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
            return engine
        except Exception as e:
            logger.warning(f"MySQL connection failed ({e}). Checking for fallback...")
            if not settings.SQLITE_FALLBACK:
                raise e

    # 3. SQLite Fallback (Local Development & Offline Testing)
    logger.info("Using SQLite database for reliable execution.")
    return create_engine(
        settings.SQLITE_URL,
        connect_args={"check_same_thread": False}
    )

engine = get_engine()
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def init_db():
    from app import models  # noqa
    Base.metadata.create_all(bind=engine)
