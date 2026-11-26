import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base

from dotenv import load_dotenv
load_dotenv()

import os
import logging
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base

from dotenv import load_dotenv
load_dotenv()

logger = logging.getLogger(__name__)

# Fallback to sqlite if DATABASE_URL is not set or default
SQLALCHEMY_DATABASE_URL = os.getenv(
    "DATABASE_URL", 
    "sqlite:///./data/mnemora.db"
)

# Normalize legacy postgres:// scheme to postgresql:// for SQLAlchemy 2.0+
if SQLALCHEMY_DATABASE_URL.startswith("postgres://"):
    SQLALCHEMY_DATABASE_URL = SQLALCHEMY_DATABASE_URL.replace("postgres://", "postgresql://", 1)

def _create_sqlite_dir(url: str):
    if url.startswith("sqlite:///"):
        db_path = url.replace("sqlite:///", "")
        db_dir = os.path.dirname(db_path)
        if db_dir:
            os.makedirs(db_dir, exist_ok=True)

ACTIVE_DB_TYPE = "SQLite (Local DB)"
engine = None

if SQLALCHEMY_DATABASE_URL.startswith("sqlite"):
    _create_sqlite_dir(SQLALCHEMY_DATABASE_URL)
    engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
    ACTIVE_DB_TYPE = "SQLite (Local DB)"
else:
    # Remote database (e.g. PostgreSQL / Supabase)
    try:
        # Test connection with a 5-second timeout to prevent indefinite container hang/crash
        temp_engine = create_engine(
            SQLALCHEMY_DATABASE_URL, 
            connect_args={"connect_timeout": 5},
            pool_pre_ping=True
        )
        with temp_engine.connect() as conn:
            pass
        engine = temp_engine
        ACTIVE_DB_TYPE = "PostgreSQL"
        logger.info("Successfully connected to primary PostgreSQL database.")
    except Exception as exc:
        logger.warning(
            f"Failed to connect to configured DATABASE_URL: {exc}. "
            "Falling back to local SQLite to ensure the application remains operational."
        )
        fallback_url = "sqlite:///./data/mnemora.db"
        _create_sqlite_dir(fallback_url)
        engine = create_engine(fallback_url, connect_args={"check_same_thread": False})
        ACTIVE_DB_TYPE = "SQLite (Fallback - Remote DB Unreachable)"

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

