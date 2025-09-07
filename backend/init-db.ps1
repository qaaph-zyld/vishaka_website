<#
.SYNOPSIS
    Initialize the database for the Vedic Astrology Platform.
.DESCRIPTION
    This script initializes the database by:
    1. Creating the database if it doesn't exist
    2. Running database migrations
    3. Creating initial admin user
#>

# Stop on first error
$ErrorActionPreference = "Stop"

# Import environment variables from .env file
if (Test-Path .\.env) {
    Get-Content .\.env | ForEach-Object {
        $name, $value = $_.Split('=', 2)
        if ($name -and $value) {
            [System.Environment]::SetEnvironmentVariable($name, $value, 'Process')
        }
    }
} else {
    Write-Error ".env file not found. Please create it from .env.example"
    exit 1
}

# Check if PostgreSQL is running
$pgService = Get-Service -Name "postgresql-*" -ErrorAction SilentlyContinue
if (-not $pgService) {
    Write-Error "PostgreSQL service not found. Please install and start PostgreSQL."
    exit 1
}

if ($pgService.Status -ne 'Running') {
    Write-Host "Starting PostgreSQL service..." -ForegroundColor Cyan
    Start-Service $pgService.Name
    Start-Sleep -Seconds 5  # Give PostgreSQL time to start
}

# Check if psql is available
try {
    $null = Get-Command psql -ErrorAction Stop
} catch {
    Write-Error "psql command not found. Please add PostgreSQL bin directory to PATH."
    exit 1
}

# Get database connection parameters
$dbUser = [System.Environment]::GetEnvironmentVariable('POSTGRES_USER', 'Process')
$dbPassword = [System.Environment]::GetEnvironmentVariable('POSTGRES_PASSWORD', 'Process')
$dbName = [System.Environment]::GetEnvironmentVariable('POSTGRES_DB', 'Process')
$dbHost = [System.Environment]::GetEnvironmentVariable('POSTGRES_SERVER', 'Process')

# Create database if it doesn't exist
Write-Host "Checking if database exists..." -ForegroundColor Cyan
$dbExists = & psql -h $dbHost -U $dbUser -lqt | cut -d \| -f 1 | grep -wq $dbName; $?

if (-not $dbExists) {
    Write-Host "Creating database $dbName..." -ForegroundColor Cyan
    $env:PGPASSWORD = $dbPassword
    & createdb -h $dbHost -U $dbUser -E UTF-8 $dbName
    if ($LASTEXITCODE -ne 0) {
        Write-Error "Failed to create database $dbName"
        exit 1
    }
}

# Activate virtual environment if exists
$venvPath = ".venv"
if (Test-Path $venvPath) {
    Write-Host "Activating virtual environment..." -ForegroundColor Cyan
    . "$venvPath\Scripts\Activate.ps1"
}

# Install dependencies if not already installed
try {
    $null = Import-Module sqlalchemy -ErrorAction Stop
} catch {
    Write-Host "Installing Python dependencies..." -ForegroundColor Cyan
    pip install -r requirements.txt
    pip install -r requirements-dev.txt
}

# Run database migrations
Write-Host "Running database migrations..." -ForegroundColor Cyan
alembic upgrade head
if ($LASTEXITCODE -ne 0) {
    Write-Error "Failed to run database migrations"
    exit 1
}

# Initialize the database
Write-Host "Initializing database..." -ForegroundColor Cyan
python -c "from app.db.init_db import init_db; init_db()"
if ($LASTEXITCODE -ne 0) {
    Write-Error "Failed to initialize database"
    exit 1
}

Write-Host "`nDatabase setup completed successfully!" -ForegroundColor Green
Write-Host "You can now start the development server with: uvicorn app.main:app --reload" -ForegroundColor Green
