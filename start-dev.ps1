# Check if .env exists
if (-not (Test-Path .env)) {
    Write-Host "Error: .env file not found. Please run setup-dev.bat first." -ForegroundColor Red
    exit 1
}

# Load environment variables
Get-Content .env | ForEach-Object {
    $name, $value = $_.Split('=', 2)
    if ($name -and $name[0] -ne '#') {
        Set-Content env:\$name $value
    }
}

# Check if Docker is running
try {
    docker info | Out-Null
} catch {
    Write-Host "Docker is not running. Please start Docker Desktop and try again." -ForegroundColor Red
    exit 1
}

# Start database and Matomo
Write-Host "Starting database and analytics services..." -ForegroundColor Cyan
docker-compose -f docker-compose.db.yml up -d

# Wait for PostgreSQL to be ready
$dbReady = $false
$attempts = 0
$maxAttempts = 30

Write-Host "Waiting for PostgreSQL to be ready..." -ForegroundColor Cyan
while (-not $dbReady -and $attempts -lt $maxAttempts) {
    try {
        docker exec vishaka-db pg_isready -U $env:DB_USER | Out-Null
        $dbReady = $true
    } catch {
        $attempts++
        Write-Host "." -NoNewline -ForegroundColor Cyan
        Start-Sleep -Seconds 1
    }
}

if (-not $dbReady) {
    Write-Host "\nTimed out waiting for PostgreSQL to start." -ForegroundColor Red
    exit 1
}

Write-Host "\nPostgreSQL is ready!" -ForegroundColor Green

# Install dependencies if node_modules doesn't exist
if (-not (Test-Path node_modules)) {
    Write-Host "Installing dependencies..." -ForegroundColor Cyan
    npm install
}

# Start the development server
Write-Host "Starting development server..." -ForegroundColor Cyan
Write-Host "Access the application at: http://localhost:3000" -ForegroundColor Green
Write-Host "Access Matomo at: http://localhost:8080" -ForegroundColor Green
Write-Host ""

npm run dev
