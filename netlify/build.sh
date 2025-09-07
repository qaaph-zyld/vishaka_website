#!/bin/bash

# Exit on error
set -e

# Set Python path
export PYTHONPATH="/opt/build/repo/backend:$PYTHONPATH"

# Create virtual environment if it doesn't exist
if [ ! -d "venv" ]; then
    echo "Creating Python virtual environment..."
    python -m venv venv
fi

# Activate virtual environment
source venv/bin/activate

# Upgrade pip
python -m pip install --upgrade pip

# Install Python dependencies
echo "Installing Python dependencies..."
pip install -r backend/requirements.txt

# Install Netlify function dependencies
pip install -r netlify/functions/api/requirements.txt

# Install Node.js dependencies
echo "Installing Node.js dependencies..."
npm install

# Build the frontend
echo "Building frontend..."
npm run build

# Create static directory if it doesn't exist
mkdir -p backend/app/static

# Copy frontend build to static directory
echo "Copying frontend files..."
cp -R .next/static/* backend/app/static/

echo "Build completed successfully!"
