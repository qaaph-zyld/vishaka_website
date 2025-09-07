# Script to initialize the production database
# Replace the connection string with your Neon PostgreSQL connection string

param (
    [string]$ConnectionString = "postgresql://user:password@ep-xxx.neon.tech/dbname"
)

# Set the DATABASE_URL environment variable
$env:DATABASE_URL = $ConnectionString

# Install required Python packages if not already installed
python -m pip install --upgrade pip
pip install alembic psycopg2-binary

# Run migrations
alembic upgrade head

# Create initial admin user (use a strong password in production)
python -c "
import os
from app.db.session import SessionLocal
from app.core.config import settings
from app.models.user import User
from app.core.security import get_password_hash

db = SessionLocal()

try:
    # Create admin user if it doesn't exist
    user = db.query(User).filter(User.email == os.getenv('FIRST_SUPERUSER')).first()
    if not user:
        user_in = {
            'email': os.getenv('FIRST_SUPERUSER'),
            'password': get_password_hash(os.getenv('FIRST_SUPERUSER_PASSWORD')),
            'is_superuser': True,
            'full_name': 'Admin User',
            'is_active': True
        }
        user = User(**user_in)
        db.add(user)
        db.commit()
        print('Admin user created successfully')
    else:
        print('Admin user already exists')
finally:
    db.close()
"

Write-Host "Database initialization complete!"
