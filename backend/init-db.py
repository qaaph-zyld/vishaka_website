#!/usr/bin/env python3
"""
Initialize the database with required tables and initial data.
"""
import logging
import sys
from pathlib import Path

# Add the backend directory to the Python path
sys.path.append(str(Path(__file__).parent))

from app.core.config import settings
from app.db.init_db import init_db, check_db_connection
from app.db.session import engine, Base

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def main() -> None:
    """Main function to initialize the database."""
    logger.info("Starting database initialization...")
    
    # Check database connection
    if not check_db_connection():
        logger.error("Failed to connect to the database. Please check your database settings.")
        sys.exit(1)
    
    # Initialize the database
    init_db()
    
    logger.info("Database initialization complete.")

if __name__ == "__main__":
    main()
