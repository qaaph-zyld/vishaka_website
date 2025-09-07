<#
.SYNOPSIS
    Start the development server for the Vedic Astrology Platform.
.DESCRIPTION
    This script starts the FastAPI development server with auto-reload enabled.
    It loads environment variables from the .env file and ensures all dependencies are installed.
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

# Check if virtual environment exists and activate it
$venvPath = ".venv"
if (Test-Path $venvPath) {
    Write-Host "Activating virtual environment..." -ForegroundColor Cyan
    . "$venvPath\Scripts\Activate.ps1"
} else {
    Write-Error "Virtual environment not found. Please run setup-dev.ps1 first."
    exit 1
}

# Check if all dependencies are installed
try {
    $null = Import-ModModule fastapi -ErrorAction Stop
} catch {
    Write-Host "Installing Python dependencies..." -ForegroundColor Cyan
    pip install -r requirements.txt
}

# Start the development server
Write-Host "Starting development server..." -ForegroundColor Cyan
Write-Host "API documentation will be available at: http://localhost:8000/docs" -ForegroundColor Green
Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Yellow

# Start Uvicorn with auto-reload
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
