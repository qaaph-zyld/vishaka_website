# Vishaka Vedic Astrology - Netlify Deployment Script

# Configuration
$siteName = "vishaka-astrology"
$buildDir = ".\out"

# Colors for output
$ErrorActionPreference = "Stop"
$host.UI.RawUI.ForegroundColor = "White"

function Write-Info {
    param($message)
    Write-Host "[INFO] $message" -ForegroundColor Cyan
}

function Write-Success {
    param($message)
    Write-Host "[SUCCESS] $message" -ForegroundColor Green
}

function Write-Error {
    param($message)
    Write-Host "[ERROR] $message" -ForegroundColor Red
}

function Invoke-CommandWithCheck {
    param (
        [string]$command,
        [string]$errorMessage = "Command failed"
    )
    
    Write-Info "Executing: $command"
    try {
        $output = Invoke-Expression $command 2>&1 | Out-String
        if ($LASTEXITCODE -ne 0) {
            throw $output
        }
        Write-Host $output -ForegroundColor Green
        return $output
    }
    catch {
        Write-Error "$errorMessage : $_"
        exit 1
    }
}

try {
    # Check for required environment variables
    if (-not $env:NETLIFY_AUTH_TOKEN) {
        throw "NETLIFY_AUTH_TOKEN environment variable is not set. Please set it with: `$env:NETLIFY_AUTH_TOKEN='your-token'"
    }

    # Install dependencies
    Write-Info "Installing dependencies..."
    Invoke-CommandWithCheck "npm install" "Failed to install dependencies"

    # Generate Prisma client
    Write-Info "Generating Prisma client..."
    Invoke-CommandWithCheck "npx prisma generate" "Failed to generate Prisma client"

    # Build the application
    Write-Info "Building the application..."
    Invoke-CommandWithCheck "npm run build" "Build failed"

    # Export static site
    Write-Info "Exporting static site..."
    Invoke-CommandWithCheck "npm run export" "Failed to export static site"

    # Deploy to Netlify
    Write-Info "Deploying to Netlify..."
    $deployCmd = "netlify deploy --dir $buildDir --prod --site $siteName --auth $env:NETLIFY_AUTH_TOKEN"
    $deployOutput = Invoke-CommandWithCheck $deployCmd "Netlify deployment failed"
    
    # Extract website URL
    $websiteUrl = $deployOutput | Select-String -Pattern 'Website URL:' | ForEach-Object { $_.ToString().Split(':')[1].Trim() }
    
    if ($websiteUrl) {
        Write-Success "Deployment completed successfully!"
        Write-Host "`n🌐 Your site is now live at: $websiteUrl" -ForegroundColor Cyan
        Write-Host "📚 API Documentation: $websiteUrl/docs" -ForegroundColor Cyan
    } else {
        Write-Success "Deployment completed, but couldn't extract website URL. Check Netlify dashboard for details."
    }
}
catch {
    Write-Error "Deployment failed: $_"
    exit 1
}
