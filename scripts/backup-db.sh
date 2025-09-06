#!/bin/bash
set -e

# Load environment variables
if [ -f .env ]; then
  export $(grep -v '^#' .env | xargs)
fi

# Create backup directory if it doesn't exist
BACKUP_DIR="./backups"
mkdir -p "$BACKUP_DIR"

# Generate timestamp
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="$BACKUP_DIR/backup_${TIMESTAMP}.sql"

# Backup PostgreSQL database
echo "Backing up database to $BACKUP_FILE..."
PGPASSWORD=${DB_PASSWORD} pg_dump -h localhost -U ${DB_USER:-vishaka} -d ${DB_NAME:-vishaka} -f "$BACKUP_FILE"

# Compress the backup
gzip -f "$BACKUP_FILE"

echo "Backup completed: ${BACKUP_FILE}.gz"

# Optional: Keep only the last 7 backups
# find "$BACKUP_DIR" -name "backup_*.sql.gz" -type f | sort -r | tail -n +8 | xargs rm -f --

echo "Backup completed successfully!"
