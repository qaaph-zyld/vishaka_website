#!/bin/bash
set -e

# Load environment variables
if [ -f .env ]; then
  export $(grep -v '^#' .env | xargs)
fi

# Check if PostgreSQL is running
if ! pg_isready -h localhost -p 5432 -U ${DB_USER:-vishaka} -d ${DB_NAME:-vishaka} >/dev/null 2>&1; then
  echo "Starting PostgreSQL container..."
  docker-compose -f docker-compose.db.yml up -d postgres
  
  # Wait for PostgreSQL to be ready
  echo "Waiting for PostgreSQL to be ready..."
  until docker exec vishaka-db pg_isready -U ${DB_USER:-vishaka}; do
    echo "PostgreSQL is unavailable - sleeping"
    sleep 1
  done
fi

# Run database migrations
echo "Running database migrations..."
npx prisma migrate deploy

# Generate Prisma client
echo "Generating Prisma client..."
npx prisma generate

echo "Database initialization complete!"
