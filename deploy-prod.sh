#!/bin/bash
set -e

# Load environment variables
if [ ! -f .env ]; then
  echo "Error: .env file not found. Please create one from .env.example"
  exit 1
fi

# Build the application
echo "Building the application..."
docker-compose -f docker-compose.prod.yml build

# Start the database and analytics services
echo "Starting database and analytics services..."
docker-compose -f docker-compose.db.yml up -d

# Wait for PostgreSQL to be ready
echo "Waiting for PostgreSQL to be ready..."
until docker exec vishaka-db pg_isready -U ${DB_USER:-vishaka} >/dev/null 2>&1; do
  echo "PostgreSQL is unavailable - sleeping"
  sleep 1
done

# Run database migrations
echo "Running database migrations..."
docker-compose -f docker-compose.prod.yml run --rm app npx prisma migrate deploy

# Start the application
echo "Starting the application..."
docker-compose -f docker-compose.prod.yml up -d

echo ""
echo "Deployment complete!"
echo "Application is running on http://localhost:3000"
echo "Matomo analytics is available on http://localhost:8080"
