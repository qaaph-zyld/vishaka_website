#!/bin/bash
set -e

# Load environment variables
if [ -f .env ]; then
  export $(grep -v '^#' .env | xargs)
fi

# Build Docker images
echo "Building Docker images..."
docker-compose build

# Start services
echo "Starting services..."
docker-compose up -d

# Wait for PostgreSQL to be ready
echo "Waiting for PostgreSQL to be ready..."
until docker exec vishaka-db pg_isready -U vishaka; do
  echo "PostgreSQL is unavailable - sleeping"
  sleep 1
done

# Run database migrations
echo "Running database migrations..."
docker-compose exec app npx prisma migrate deploy

echo "Deployment completed successfully!"
echo "Application is running at http://localhost:3000"
echo "Matomo analytics is available at http://localhost:8080"
