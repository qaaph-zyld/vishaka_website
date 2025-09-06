#!/bin/bash
set -e

# Check if .env file exists
if [ -f .env ]; then
  echo "Warning: .env file already exists. Creating a backup at .env.backup.$(date +%Y%m%d_%H%M%S)"
  cp .env ".env.backup.$(date +%Y%m%d_%H%M%S)"
fi

# Generate a random secret for NextAuth
NEXTAUTH_SECRET=$(openssl rand -base64 32)

# Generate a random password for the database
DB_PASSWORD=$(openssl rand -base64 16 | tr -dc 'a-zA-Z0-9' | head -c 16)

# Generate a random password for Matomo database
MATOMO_DB_PASSWORD=$(openssl rand -base64 16 | tr -dc 'a-zA-Z0-9' | head -c 16)
MATOMO_DB_ROOT_PASSWORD=$(openssl rand -base64 32 | tr -dc 'a-zA-Z0-9' | head -c 32)

# Create a new .env file
cat > .env <<EOL
# Database Configuration
DB_USER=vishaka
DB_PASSWORD=${DB_PASSWORD}
DB_NAME=vishaka
DATABASE_URL="postgresql://vishaka:${DB_PASSWORD}@localhost:5432/vishaka?schema=public"
DIRECT_URL="postgresql://vishaka:${DB_PASSWORD}@localhost:5432/vishaka?schema=public&connection_limit=1"

# Next.js Configuration
NODE_ENV=development
NEXTAUTH_SECRET="${NEXTAUTH_SECRET}"
NEXTAUTH_URL=http://localhost:3000

# Matomo Configuration
NEXT_PUBLIC_MATOMO_URL=http://localhost:8080
NEXT_PUBLIC_MATOMO_SITE_ID=1
MATOMO_DB_PASSWORD=${MATOMO_DB_PASSWORD}
MATOMO_DB_ROOT_PASSWORD=${MATOMO_DB_ROOT_PASSWORD}

# Storage (for file uploads)
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=10485760 # 10MB

# CORS (comma-separated origins)
NEXT_PUBLIC_ALLOWED_ORIGINS=http://localhost:3000
EOL

echo "Environment configuration created successfully!"
echo "Please review the generated .env file and update any values as needed."
