# Development Docker Compose Startup Script

Write-Host "Starting Ellty Comment System in Development Mode..." -ForegroundColor Green

# Stop and remove existing containers
Write-Host "`nStopping existing containers..." -ForegroundColor Yellow
docker-compose -f docker-compose.dev.yml down

# Start services with volume mounts for hot reload
Write-Host "`nStarting services in development mode..." -ForegroundColor Yellow
docker-compose -f docker-compose.dev.yml up -d

# Wait a moment for services to start
Start-Sleep -Seconds 3

# Show service status
Write-Host "`nService Status:" -ForegroundColor Green
docker-compose -f docker-compose.dev.yml ps

Write-Host "`n================================" -ForegroundColor Green
Write-Host "Development Environment Ready!" -ForegroundColor Green
Write-Host "================================" -ForegroundColor Green
Write-Host "Frontend: http://localhost:3000" -ForegroundColor Cyan
Write-Host "Backend API: http://localhost:5000/api" -ForegroundColor Cyan
Write-Host "MongoDB: localhost:27017" -ForegroundColor Cyan
Write-Host "`nHot reload is enabled for both frontend and backend" -ForegroundColor Yellow
Write-Host "`nTo view logs:" -ForegroundColor Yellow
Write-Host "  docker-compose -f docker-compose.dev.yml logs -f" -ForegroundColor Cyan
Write-Host "`nTo stop services:" -ForegroundColor Yellow
Write-Host "  docker-compose -f docker-compose.dev.yml down" -ForegroundColor Cyan
Write-Host "================================`n" -ForegroundColor Green
