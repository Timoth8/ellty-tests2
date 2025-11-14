# Ellty Comment System - Quick Setup Script
Write-Host "🚀 Setting up Ellty Comment System..." -ForegroundColor Cyan
Write-Host ""

# Check if Node.js is installed
Write-Host "📦 Checking Node.js installation..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js version: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js is not installed. Please install Node.js from https://nodejs.org/" -ForegroundColor Red
    exit 1
}

# Check if MongoDB is installed
Write-Host "📦 Checking MongoDB installation..." -ForegroundColor Yellow
try {
    $mongoService = Get-Service MongoDB -ErrorAction SilentlyContinue
    if ($mongoService) {
        Write-Host "✅ MongoDB service found" -ForegroundColor Green
        if ($mongoService.Status -ne 'Running') {
            Write-Host "⚠️  MongoDB is not running. Starting MongoDB..." -ForegroundColor Yellow
            Start-Service MongoDB
            Write-Host "✅ MongoDB started" -ForegroundColor Green
        }
    } else {
        Write-Host "⚠️  MongoDB service not found. Make sure MongoDB is installed and running." -ForegroundColor Yellow
        Write-Host "   You can download MongoDB from: https://www.mongodb.com/try/download/community" -ForegroundColor Yellow
    }
} catch {
    Write-Host "⚠️  Could not check MongoDB status" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "📦 Installing backend dependencies..." -ForegroundColor Yellow
npm install

Write-Host ""
Write-Host "📦 Installing frontend dependencies..." -ForegroundColor Yellow
Set-Location client
npm install
Set-Location ..

Write-Host ""
Write-Host "🌱 Seeding database with sample data..." -ForegroundColor Yellow
npm run seed

Write-Host ""
Write-Host "✅ Setup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "To start the application, run:" -ForegroundColor Cyan
Write-Host "  npm run dev" -ForegroundColor White
Write-Host ""
Write-Host "Then open your browser to:" -ForegroundColor Cyan
Write-Host "  http://localhost:3000" -ForegroundColor White
Write-Host ""
