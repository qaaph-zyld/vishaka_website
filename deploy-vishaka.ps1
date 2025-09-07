# Vishaka Vedic Astrology - Deployment Script

# Configuration
$siteName = "vishaka-astrology"
$buildDir = ".\out"

# Function to execute a command and check its status
function Invoke-CommandWithCheck {
    param (
        [string]$command,
        [string]$errorMessage = "Command failed"
    )
    
    Write-Host "Executing: $command" -ForegroundColor Cyan
    $output = Invoke-Expression $command 2>&1 | Out-String
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "[ERROR] $errorMessage" -ForegroundColor Red
        Write-Host $output -ForegroundColor Red
        exit 1
    }
    
    Write-Host $output -ForegroundColor Green
    return $output
}

try {
    # Install dependencies
    Invoke-CommandWithCheck "npm install" "Failed to install Node.js dependencies"
    
    # Generate Prisma client
    Invoke-CommandWithCheck "npx prisma generate" "Failed to generate Prisma client"
    
    # Build the frontend
    Invoke-CommandWithCheck "npm run build" "Failed to build the application"
    
    # Export static site
    Invoke-CommandWithCheck "npm run export" "Failed to export static site"
    
    # Deploy to Netlify
    if (-not $env:NETLIFY_AUTH_TOKEN) {
        throw "NETLIFY_AUTH_TOKEN environment variable is not set. Please set it with: `$env:NETLIFY_AUTH_TOKEN='your-token'"
    }
    
    Write-Host "Deploying to Netlify..." -ForegroundColor Cyan
    $deployOutput = netlify deploy --dir $buildDir --prod --site $siteName --auth $env:NETLIFY_AUTH_TOKEN 2>&1 | Out-String
    
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
        Write-Host $deployOutput -ForegroundColor Red
        exit 1
    }
}
catch {
    Write-Host "[ERROR] An error occurred: $_" -ForegroundColor Red
    exit 1
}
