# Production Docker Compose Startup Script

Write-Host "Starting Ellty Comment System in Production Mode..." -ForegroundColor Green

# Check if .env file exists
if (-not (Test-Path ".env")) {
    Write-Host "Error: .env file not found!" -ForegroundColor Red
    Write-Host "Please copy .env.production to .env and update the values:" -ForegroundColor Yellow
    Write-Host "  Copy-Item .env.production .env" -ForegroundColor Cyan
    exit 1
}

# Stop and remove existing containers
Write-Host "`nStopping existing containers..." -ForegroundColor Yellow
docker-compose down

# Build images
Write-Host "`nBuilding Docker images..." -ForegroundColor Yellow
docker-compose build --no-cache

# Start services
Write-Host "`nStarting services..." -ForegroundColor Yellow
docker-compose up -d

# Wait for services to be healthy
Write-Host "`nWaiting for services to be healthy..." -ForegroundColor Yellow
Start-Sleep -Seconds 5

# Show service status
Write-Host "`nService Status:" -ForegroundColor Green
docker-compose ps

Write-Host "`n================================" -ForegroundColor Green
Write-Host "Application is starting up!" -ForegroundColor Green
Write-Host "================================" -ForegroundColor Green
Write-Host "Frontend: http://localhost" -ForegroundColor Cyan
Write-Host "Backend API: http://localhost:5000/api" -ForegroundColor Cyan
Write-Host "MongoDB: localhost:27017" -ForegroundColor Cyan
Write-Host "`nTo view logs:" -ForegroundColor Yellow
Write-Host "  docker-compose logs -f" -ForegroundColor Cyan
Write-Host "`nTo stop services:" -ForegroundColor Yellow
Write-Host "  docker-compose down" -ForegroundColor Cyan
Write-Host "================================`n" -ForegroundColor Green
