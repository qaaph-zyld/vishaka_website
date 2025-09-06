#!/bin/bash
set -e

# Load environment variables
if [ -f .env ]; then
  export $(grep -v '^#' .env | xargs)
fi

# Check if PostgreSQL is running
if ! docker ps | grep -q vishaka-db; then
  echo "Starting PostgreSQL container..."
  docker-compose -f docker-compose.db.yml up -d postgres
  
  # Wait for PostgreSQL to be ready
  echo "Waiting for PostgreSQL to be ready..."
  until docker exec vishaka-db pg_isready -U ${DB_USER:-vishaka} >/dev/null 2>&1; do
    echo "PostgreSQL is unavailable - sleeping"
    sleep 1
  done
fi

# Create a backup before applying migrations
if [ "$1" != "--no-backup" ]; then
  echo "Creating database backup before migration..."
  ./scripts/backup-db.sh
else
  echo "Skipping backup (--no-backup flag set)"
fi

# Run database migrations
echo "Running database migrations..."
npx prisma migrate deploy

# Generate Prisma client if needed
if [ "$1" != "--no-generate" ]; then
  echo "Generating Prisma client..."
  npx prisma generate
fi

echo "Database migration completed successfully!"

echo "To apply these changes in production, run:"
echo "1. git pull origin main"
echo "2. docker-compose -f docker-compose.prod.yml up -d --build"
