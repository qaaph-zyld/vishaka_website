"""
Database initialization script.

This script is used to initialize the database with the required tables and initial data.
"""
import logging
import sys
from typing import List

from sqlalchemy import text

from app.core.config import settings
from app.db.base import Base
from app.db.session import engine, SessionLocal

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def init_db() -> None:
    """Initialize the database by creating all tables."""
    logger.info("Creating database tables...")
    try:
        # Import all models here to ensure they are registered with SQLAlchemy
        from app.models.user import UserTable
        from app.models.astrology import (
            BirthChartTable, PlanetPositionTable, 
            HouseTable, AspectTable, DashaPeriodTable
        )
        
        # Create all tables
        Base.metadata.create_all(bind=engine)
        logger.info("Database tables created successfully.")
        
        # Create initial admin user if it doesn't exist
        create_initial_admin()
        
    except Exception as e:
        logger.error(f"Error creating database tables: {e}")
        sys.exit(1)

def create_initial_admin() -> None:
    """Create an initial admin user if no users exist."""
    from app.models.user import UserTable, UserRole
    from app.core.security import get_password_hash
    
    db = SessionLocal()
    try:
        # Check if any users exist
        user_count = db.query(UserTable).count()
        
        if user_count == 0:
            logger.info("Creating initial admin user...")
            
            # Create admin user
            admin_user = UserTable(
                email=settings.FIRST_SUPERUSER_EMAIL,
                username=settings.FIRST_SUPERUSER_USERNAME,
                hashed_password=get_password_hash(settings.FIRST_SUPERUSER_PASSWORD),
                full_name="Initial Admin User",
                role=UserRole.ADMIN,
                is_active=True
            )
            
            db.add(admin_user)
            db.commit()
            logger.info(f"Admin user created: {settings.FIRST_SUPERUSER_EMAIL}")
        else:
            logger.info("Admin user already exists, skipping creation.")
            
    except Exception as e:
        logger.error(f"Error creating admin user: {e}")
        db.rollback()
    finally:
        db.close()

def check_db_connection() -> bool:
    """Check if the database connection is working."""
    db = SessionLocal()
    try:
        # Try to execute a simple query
        db.execute(text("SELECT 1"))
        logger.info("Database connection successful.")
        return True
    except Exception as e:
        logger.error(f"Database connection failed: {e}")
        return False
    finally:
        db.close()

if __name__ == "__main__":
    logger.info("Initializing database...")
    
    # Check database connection first
    if not check_db_connection():
        logger.error("Failed to connect to the database. Please check your database settings.")
        sys.exit(1)
    
    # Initialize the database
    init_db()
    logger.info("Database initialization complete.")
