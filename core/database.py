import logging
from sqlalchemy import create_engine, event
from sqlalchemy.orm import declarative_base, sessionmaker
from sqlalchemy.engine import Engine
from backend.core.config import settings

logger = logging.getLogger("healthcare.database")

Base = declarative_base()

def get_engine():
    db_url = settings.DATABASE_URL
    # Try initializing the configured database
    try:
        if db_url.startswith("sqlite"):
            engine = create_engine(db_url, connect_args={"check_same_thread": False})
            return engine
        
        # PostgreSQL engine configuration with connection pooling
        engine = create_engine(
            db_url,
            pool_size=10,
            max_overflow=20,
            pool_pre_ping=True
        )
        # Test connection
        with engine.connect() as conn:
            logger.info("Successfully connected to primary PostgreSQL database.")
        return engine
    except Exception as e:
        logger.warning(f"Could not connect to configured PostgreSQL ({e}). Falling back to local SQLite database for development.")
        sqlite_url = "sqlite:///./healthcare.db"
        sqlite_engine = create_engine(sqlite_url, connect_args={"check_same_thread": False})
        return sqlite_engine

engine = get_engine()

# Enable foreign keys for SQLite if fallback is in use
@event.listens_for(Engine, "connect")
def set_sqlite_pragma(dbapi_connection, connection_record):
    if engine.url.drivername.startswith("sqlite"):
        cursor = dbapi_connection.cursor()
        cursor.execute("PRAGMA foreign_keys=ON")
        cursor.execute("PRAGMA journal_mode=WAL")
        cursor.close()

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_db():
    """FastAPI Dependency for database sessions with automatic closure."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
