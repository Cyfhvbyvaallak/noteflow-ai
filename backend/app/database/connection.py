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
    if db_url.startswith("postgresql") or db_url.startswith("postgres"):
        import re

        candidate_urls = []

        # If direct IPv6 host db.xxx.supabase.co was used, add IPv4 connection pooler candidate
        match = re.search(r'postgres:([^@]+)@db\.([a-zA-Z0-9]+)\.supabase\.co', db_url)
        if match:
            pwd, ref = match.group(1), match.group(2)
            candidate_urls.append(f"postgresql+psycopg2://postgres.{ref}:{pwd}@aws-0-ap-south-1.pooler.supabase.com:6543/postgres")
            candidate_urls.append(f"postgresql+psycopg2://postgres.{ref}:{pwd}@aws-0-ap-south-1.pooler.supabase.com:5432/postgres")

        # Standardize configured URL
        clean_url = db_url
        if clean_url.startswith("postgres://"):
            clean_url = clean_url.replace("postgres://", "postgresql+psycopg2://", 1)
        elif clean_url.startswith("postgresql://") and not clean_url.startswith("postgresql+"):
            clean_url = clean_url.replace("postgresql://", "postgresql+psycopg2://", 1)
        candidate_urls.append(clean_url)

        last_error = None
        for cand_url in candidate_urls:
            try:
                engine = create_engine(
                    cand_url,
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
                last_error = e

        # Pure-Python pg8000 fallback
        if match:
            try:
                pg8000_url = f"postgresql+pg8000://postgres.{ref}:{pwd}@aws-0-ap-south-1.pooler.supabase.com:5432/postgres"
                engine = create_engine(pg8000_url, pool_pre_ping=True, pool_recycle=300)
                with engine.connect() as conn:
                    logger.info("Connected to PostgreSQL using pg8000 driver!")
                engine_info["type"] = "PostgreSQL (Supabase)"
                engine_info["connected"] = True
                engine_info["note"] = "Connected to Supabase cloud database via pg8000"
                return engine
            except Exception as e2:
                last_error = e2

        engine_info["note"] = f"PostgreSQL error: {str(last_error)[:120]}"
        if not settings.SQLITE_FALLBACK:
            raise last_error

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
