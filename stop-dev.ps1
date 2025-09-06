# Stop and remove all containers
docker-compose -f docker-compose.db.yml down

Write-Host "Development environment stopped successfully." -ForegroundColor Green
