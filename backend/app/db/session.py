"""
Database session management.
"""
from typing import Generator
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session

from ..core.config import settings

# Create SQLAlchemy engine
engine = create_engine(
    settings.DATABASE_URI,
    pool_pre_ping=True,
    pool_size=10,
    max_overflow=20,
    pool_recycle=3600,
    connect_args={"connect_timeout": 10}
)

# Session factory
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base class for models
Base = declarative_base()

def get_db() -> Generator[Session, None, None]:
    ""
    Dependency function that yields database sessions.
    
    Yields:
        Session: A database session
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def init_db() -> None:
    """Initialize database tables."""
    # Import all models here to ensure they are registered with SQLAlchemy
    from ..models.user import UserTable
    from ..models.astrology import (
        BirthChart, PlanetPosition, House, Aspect, DashaPeriod, 
        Transit, Yogas, HoraryChart, PrashnaKundli, Muhurta
    )
    
    Base.metadata.create_all(bind=engine)

def get_db_session() -> Session:
    """Get a database session."""
    return SessionLocal()
