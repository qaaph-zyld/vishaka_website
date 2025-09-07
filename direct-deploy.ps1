# Direct deployment script for Netlify

# Set error action preference
$ErrorActionPreference = "Stop"

# Configuration
$siteName = "vishaka-astrology"
$buildDir = ".\out"
$functionDir = ".\netlify\functions"

# Install dependencies
Write-Host "Installing dependencies..." -ForegroundColor Cyan
npm install

# Generate Prisma client
Write-Host "Generating Prisma client..." -ForegroundColor Cyan
npx prisma generate

# Build the frontend
Write-Host "Building frontend..." -ForegroundColor Cyan
npm run build:static

# Check if build was successful
if (-not (Test-Path $buildDir)) {
    Write-Host "Build failed. Output directory not found: $buildDir" -ForegroundColor Red
    exit 1
}

# Copy Netlify functions
if (Test-Path $functionDir) {
    Write-Host "Copying Netlify functions..." -ForegroundColor Cyan
    $functionsDest = "$buildDir\functions"
    New-Item -ItemType Directory -Path $functionsDest -Force | Out-Null
    Copy-Item -Path "$functionDir\*" -Destination $functionsDest -Recurse -Force
}

# Check if NETLIFY_AUTH_TOKEN is set
if (-not $env:NETLIFY_AUTH_TOKEN) {
    Write-Host "NETLIFY_AUTH_TOKEN environment variable is not set." -ForegroundColor Red
    Write-Host "Please set it with: `$env:NETLIFY_AUTH_TOKEN='your-token'" -ForegroundColor Yellow
    exit 1
}

# Install netlify-cli if not installed
if (-not (Get-Command netlify -ErrorAction SilentlyContinue)) {
    Write-Host "Installing Netlify CLI..." -ForegroundColor Cyan
    npm install -g netlify-cli
}

# Deploy to Netlify
Write-Host "Deploying to Netlify..." -ForegroundColor Cyan
try {
    $deployOutput = netlify deploy --dir $buildDir --prod --site $siteName --auth $env:NETLIFY_AUTH_TOKEN 2>&1
    $deployOutput | ForEach-Object { Write-Host $_ }
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "`n[SUCCESS] Deployment completed successfully!" -ForegroundColor Green
        
        # Extract and display the website URL
        $websiteUrl = $deployOutput | Select-String -Pattern 'Website URL:' | ForEach-Object { $_.ToString().Split(':')[1].Trim() }
        if ($websiteUrl) {
            Write-Host "[INFO] Your site is now live at: $websiteUrl" -ForegroundColor Cyan
            Write-Host "[INFO] API Documentation: $websiteUrl/docs" -ForegroundColor Cyan
        }
    } else {
        Write-Host "[ERROR] Deployment failed. Please check the output above for errors." -ForegroundColor Red
        exit 1
    }
} catch {
    Write-Host "[ERROR] An error occurred during deployment: $_" -ForegroundColor Red
    exit 1
}
