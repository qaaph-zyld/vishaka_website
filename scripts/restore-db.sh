#!/bin/bash
set -e

# Check if backup file is provided
if [ -z "$1" ]; then
  echo "Usage: $0 <backup_file.sql.gz>"
  exit 1
fi

BACKUP_FILE="$1"

# Check if the backup file exists
if [ ! -f "$BACKUP_FILE" ]; then
  echo "Error: Backup file $BACKUP_FILE not found"
  exit 1
fi

# Load environment variables
if [ -f .env ]; then
  export $(grep -v '^#' .env | xargs)
fi

# Check if the database is running
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

# Drop and recreate the database
echo "Recreating database..."
PGPASSWORD=${DB_PASSWORD} dropdb -h localhost -U ${DB_USER:-vishaka} --if-exists ${DB_NAME:-vishaka}
PGPASSWORD=${DB_PASSWORD} createdb -h localhost -U ${DB_USER:-vishaka} ${DB_NAME:-vishaka}

# Restore the database
echo "Restoring database from $BACKUP_FILE..."
gunzip -c "$BACKUP_FILE" | PGPASSWORD=${DB_PASSWORD} psql -h localhost -U ${DB_USER:-vishaka} -d ${DB_NAME:-vishaka}

echo "Database restored successfully from $BACKUP_FILE"
