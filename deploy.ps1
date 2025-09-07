# Deploy script for Vishaka Vedic Astrology

# Set error action preference
$ErrorActionPreference = "Stop"

# Function to check if a command exists
function Test-CommandExists {
    param($command)
    $exists = $null -ne (Get-Command $command -ErrorAction SilentlyContinue)
    if (-not $exists) {
        Write-Host "Command not found: $command" -ForegroundColor Yellow
    }
    return $exists
}

# Check for required commands
$requiredCommands = @("node", "npm", "python")
foreach ($cmd in $requiredCommands) {
    if (-not (Test-CommandExists $cmd)) {
        Write-Host "Error: $cmd is required but not found. Please install it and try again." -ForegroundColor Red
        exit 1
    }
}

# Install Netlify CLI if not installed
if (-not (Test-CommandExists "netlify")) {
    Write-Host "Installing Netlify CLI..." -ForegroundColor Cyan
    npm install -g netlify-cli
}

# Login to Netlify if not already logged in
try {
    $netlifyWhoami = netlify status 2>&1
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Logging in to Netlify..." -ForegroundColor Cyan
        netlify login
    } else {
        Write-Host "Already logged in to Netlify as: $($netlifyWhoami | Select-String 'You are logged in as')" -ForegroundColor Green
    }
} catch {
    Write-Host "Error checking Netlify login status: $_" -ForegroundColor Red
    exit 1
}

# Build the application
Write-Host "Building the application..." -ForegroundColor Cyan

# Install Python dependencies
Write-Host "Installing Python dependencies..." -ForegroundColor Cyan
python -m venv .venv
. \.venv\Scripts\Activate.ps1
pip install --upgrade pip
pip install -r backend/requirements.txt

# Install Node.js dependencies
Write-Host "Installing Node.js dependencies..." -ForegroundColor Cyan
npm install

# Build the frontend
Write-Host "Building frontend..." -ForegroundColor Cyan
npm run build

# Deploy to Netlify
Write-Host "Deploying to Netlify..." -ForegroundColor Cyan
netlify deploy --prod

if ($LASTEXITCODE -eq 0) {
    Write-Host "Deployment completed successfully!" -ForegroundColor Green
    Write-Host "Your site is now live at the URL shown above." -ForegroundColor Green
} else {
    Write-Host "Deployment failed. Please check the output for errors." -ForegroundColor Red
    exit 1
}
