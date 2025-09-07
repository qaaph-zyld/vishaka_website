# Deploy to Netlify script for Windows

# Set error action preference
$ErrorActionPreference = "Stop"

# Check for required commands
function Test-CommandExists {
    param($command)
    $exists = $null -ne (Get-Command $command -ErrorAction SilentlyContinue)
    if (-not $exists) {
        Write-Host "Installing $command..." -ForegroundColor Yellow
    }
    return $exists
}

# Install Netlify CLI if not installed
if (-not (Test-CommandExists "netlify")) {
    npm install -g netlify-cli
}

# Install Python if not found
if (-not (Test-CommandExists "python")) {
    Write-Host "Python is required but not found. Please install Python 3.8+ and try again." -ForegroundColor Red
    exit 1
}

# Login to Netlify if not already logged in
try {
    $netlifyWhoami = netlify status 2>&1
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Logging in to Netlify..."
        netlify login
    } else {
        Write-Host "Already logged in to Netlify as: $($netlifyWhoami | Select-String 'You are logged in as')"
    }
} catch {
    Write-Host "Error checking Netlify login status: $_"
    exit 1
}

# Setup Python environment
Write-Host "Setting up Python environment..." -ForegroundColor Cyan
.\setup-env.ps1
if ($LASTEXITCODE -ne 0) {
    Write-Host "Failed to set up Python environment" -ForegroundColor Red
    exit 1
}

# Initialize production database
Write-Host "Initializing production database..." -ForegroundColor Cyan
.\init-prod-db.ps1
if ($LASTEXITCODE -ne 0) {
    Write-Host "Warning: Database initialization completed with errors. Continuing deployment..." -ForegroundColor Yellow
}

# Build the application
Write-Host "Building the application..." -ForegroundColor Cyan
.\netlify\build.sh
if ($LASTEXITCODE -ne 0) {
    Write-Host "Build failed. Please check the build output for errors." -ForegroundColor Red
    exit 1
}

# Deploy to Netlify
Write-Host "Deploying to Netlify..."
netlify deploy --prod

if ($LASTEXITCODE -eq 0) {
    Write-Host "Deployment completed successfully!"
    Write-Host "Your site is now live at the URL shown above."
} else {
    Write-Host "Deployment failed. Please check the output for errors."
    exit 1
}
