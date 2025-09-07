<#
.SYNOPSIS
    Test the Vedic Astrology Platform API endpoints.
.DESCRIPTION
    This script tests the main API endpoints to ensure they are working correctly.
    It performs basic CRUD operations and verifies the responses.
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

# Get API URL from environment or use default
$apiUrl = [System.Environment]::GetEnvironmentVariable('API_URL', 'Process')
if (-not $apiUrl) {
    $apiUrl = "http://localhost:8000/api/v1"
}

# Test function to make HTTP requests
function Test-ApiEndpoint {
    param (
        [string]$Method,
        [string]$Url,
        [object]$Body = $null,
        [hashtable]$Headers = @{},
        [switch]$RequireAuth = $false
    )

    $headers["Content-Type"] = "application/json"
    
    if ($RequireAuth) {
        if (-not $global:authToken) {
            Write-Error "Authentication required but no token available"
            return $null
        }
        $headers["Authorization"] = "Bearer $global:authToken"
    }

    $params = @{
        Method = $Method
        Uri = $Url
        Headers = $headers
        UseBasicParsing = $true
    }

    if ($Body) {
        $params.Body = $Body | ConvertTo-Json -Depth 10
    }

    try {
        $response = Invoke-RestMethod @params -ErrorAction Stop
        Write-Host "✅ $($Method.PadRight(6)) $Url - Success" -ForegroundColor Green
        return $response
    }
    catch {
        $errorDetails = $_.ErrorDetails.Message | ConvertFrom-Json -ErrorAction SilentlyContinue
        $errorMessage = if ($errorDetails.detail) { $errorDetails.detail } else { $_.Exception.Message }
        Write-Host "❌ $($Method.PadRight(6)) $Url - Failed: $errorMessage" -ForegroundColor Red
        return $null
    }
}

# Main test function
function Test-AllEndpoints {
    Write-Host "`n🚀 Starting API tests..." -ForegroundColor Cyan
    
    # 1. Test health check
    Write-Host "`n🔍 Testing health check..." -ForegroundColor Yellow
    $health = Test-ApiEndpoint -Method GET -Url "$apiUrl/health"
    if (-not $health) { return $false }

    # 2. Test authentication
    Write-Host "`n🔐 Testing authentication..." -ForegroundColor Yellow
    
    # Get admin credentials from environment
    $adminEmail = [System.Environment]::GetEnvironmentVariable('FIRST_SUPERUSER_EMAIL', 'Process')
    $adminPassword = [System.Environment]::GetEnvironmentVariable('FIRST_SUPERUSER_PASSWORD', 'Process')
    
    if (-not $adminEmail -or -not $adminPassword) {
        Write-Host "⚠️  Admin credentials not found in .env file. Skipping authenticated tests." -ForegroundColor Yellow
        return $false
    }
    
    # Login to get token
    $loginData = @{
        username = $adminEmail
        password = $adminPassword
    }
    
    $loginResponse = Test-ApiEndpoint -Method POST -Url "$apiUrl/auth/login" -Body @{
        username = $adminEmail
        password = $adminPassword
        grant_type = "password"
    } -Headers @{"Content-Type" = "application/x-www-form-urlencoded"}
    
    if (-not $loginResponse) { return $false }
    
    $global:authToken = $loginResponse.access_token
    Write-Host "🔑 Successfully authenticated as $adminEmail" -ForegroundColor Green

    # 3. Test user endpoints
    Write-Host "`n👤 Testing user endpoints..." -ForegroundColor Yellow
    
    # Get current user
    $currentUser = Test-ApiEndpoint -Method GET -Url "$apiUrl/users/me" -RequireAuth
    if (-not $currentUser) { return $false }
    
    Write-Host "✅ Successfully retrieved current user: $($currentUser.email)" -ForegroundColor Green

    # 4. Test chart endpoints
    Write-Host "`n📊 Testing chart endpoints..." -ForegroundColor Yellow
    
    # Create a test chart
    $testChart = @{
        name = "Test Chart"
        birth_date = "1990-01-01"
        birth_time = "12:00:00"
        timezone = "UTC"
        latitude = 0.0
        longitude = 0.0
        ayanamsa = 22.5
        is_primary = $true
    }
    
    $createdChart = Test-ApiEndpoint -Method POST -Url "$apiUrl/charts/" -Body $testChart -RequireAuth
    if (-not $createdChart) { return $false }
    
    $chartId = $createdChart.id
    Write-Host "✅ Successfully created chart with ID: $chartId" -ForegroundColor Green
    
    # Get the created chart
    $retrievedChart = Test-ApiEndpoint -Method GET -Url "$apiUrl/charts/$chartId" -RequireAuth
    if (-not $retrievedChart) { return $false }
    
    # List all charts
    $charts = Test-ApiEndpoint -Method GET -Url "$apiUrl/charts/" -RequireAuth
    if (-not $charts) { return $false }
    
    Write-Host "✅ Successfully retrieved $($charts.Count) charts" -ForegroundColor Green
    
    # Delete the test chart
    $deleted = Test-ApiEndpoint -Method DELETE -Url "$apiUrl/charts/$chartId" -RequireAuth
    if (-not $deleted) { return $false }
    
    Write-Host "✅ Successfully deleted test chart" -ForegroundColor Green
    
    return $true
}

# Run the tests
$success = Test-AllEndpoints

# Output final result
if ($success) {
    Write-Host "`n🎉 All tests passed successfully!" -ForegroundColor Green
    exit 0
} else {
    Write-Host "`n❌ Some tests failed. Please check the logs above for details." -ForegroundColor Red
    exit 1
}
