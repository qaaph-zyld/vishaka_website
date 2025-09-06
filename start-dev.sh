#!/bin/bash
set -e

# Load environment variables
if [ ! -f .env ]; then
  echo "Copying .env.example to .env..."
  cp .env.example .env
  echo "Please update the .env file with your configuration and run this script again."
  exit 1
fi

# Start the database and analytics services
echo "Starting database and analytics services..."
docker-compose -f docker-compose.db.yml up -d

# Run database initialization
./scripts/init-db.sh

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
  echo "Installing dependencies..."
  npm install
fi

# Start the development server
echo "Starting development server..."
npm run dev
