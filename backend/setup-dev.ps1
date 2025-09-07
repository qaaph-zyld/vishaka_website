<#
.SYNOPSIS
    Setup script for the Vedic Astrology Platform backend development environment.
.DESCRIPTION
    This script sets up the development environment by:
    1. Creating a Python virtual environment
    2. Installing Python dependencies
    3. Setting up pre-commit hooks
    4. Initializing the database
#>

# Stop on first error
$ErrorActionPreference = "Stop"

# Check if Python is installed
$pythonVersion = python --version 2>&1
if (-not $?) {
    Write-Error "Python is not installed or not in PATH. Please install Python 3.8+ and try again."
    exit 1
}

# Check Python version
$pythonVersion = [System.Version]($pythonVersion -replace ".*?([\d.]+)", '$1')
if ($pythonVersion.Major -lt 3 -or ($pythonVersion.Major -eq 3 -and $pythonVersion.Minor -lt 8)) {
    Write-Error "Python 3.8 or higher is required. Found Python $($pythonVersion.ToString())."
    exit 1
}

# Create and activate virtual environment
$venvPath = ".venv"
if (-not (Test-Path $venvPath)) {
    Write-Host "Creating Python virtual environment..." -ForegroundColor Cyan
    python -m venv $venvPath
}

# Activate the virtual environment
$activateScript = ".\$venvPath\Scripts\Activate.ps1"
if (-not (Test-Path $activateScript)) {
    Write-Error "Failed to create virtual environment. Please check Python installation."
    exit 1
}

# Import the activation script
. $activateScript

# Upgrade pip and install dependencies
Write-Host "Upgrading pip and installing dependencies..." -ForegroundColor Cyan
python -m pip install --upgrade pip
pip install -r requirements.txt

# Install development dependencies
Write-Host "Installing development dependencies..." -ForegroundColor Cyan
pip install -r requirements-dev.txt

# Install pre-commit hooks
Write-Host "Setting up pre-commit hooks..." -ForegroundColor Cyan
pre-commit install

# Create .env file if it doesn't exist
$envFile = ".env"
if (-not (Test-Path $envFile)) {
    Write-Host "Creating .env file from .env.example..." -ForegroundColor Cyan
    Copy-Item ".env.example" $envFile -Force
    Write-Host "Please update the .env file with your configuration." -ForegroundColor Yellow
}

Write-Host "`nDevelopment environment setup complete!" -ForegroundColor Green
Write-Host "Next steps:" -ForegroundColor Green
Write-Host "1. Edit the .env file with your database credentials and other settings"
Write-Host "2. Run 'python init-db.py' to initialize the database"
Write-Host "3. Run 'uvicorn app.main:app --reload' to start the development server"
Write-Host "4. Access the API documentation at http://localhost:8000/docs"
