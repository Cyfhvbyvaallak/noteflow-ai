import logging
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from app.core.config import settings

logger = logging.getLogger(__name__)

Base = declarative_base()

def get_engine():
    # Attempt connecting to MySQL first
    try:
        if settings.DATABASE_URL.startswith("mysql"):
            logger.info("Attempting connection to MySQL database...")
            engine = create_engine(
                settings.DATABASE_URL,
                pool_pre_ping=True,
                pool_recycle=3600,
                connect_args={"connect_timeout": 3}
            )
            # Test connection
            with engine.connect() as conn:
                logger.info("Successfully connected to MySQL database!")
            return engine
    except Exception as e:
        logger.warning(f"MySQL connection failed ({e}). Checking for fallback...")
        if not settings.SQLITE_FALLBACK:
            raise e

    logger.info("Using SQLite database for reliable local execution.")
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
