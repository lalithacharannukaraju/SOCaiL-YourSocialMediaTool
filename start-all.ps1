# SOCaiL - Start All Services Script (PowerShell)
# This script starts all required services for the application

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  SOCaiL - Starting All Services" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if .env exists
if (-not (Test-Path "Backend\.env")) {
    Write-Host "⚠️  WARNING: Backend\.env file not found!" -ForegroundColor Yellow
    Write-Host "Please create Backend\.env file with required environment variables." -ForegroundColor Yellow
    Write-Host "See SETUP_GUIDE.md for details." -ForegroundColor Yellow
    Write-Host ""
    $continue = Read-Host "Continue anyway? (y/n)"
    if ($continue -ne "y") {
        exit
    }
}

# Check if node_modules exist
if (-not (Test-Path "Backend\node_modules")) {
    Write-Host "📦 Installing backend dependencies..." -ForegroundColor Yellow
    Set-Location Backend
    npm install
    Set-Location ..
}

if (-not (Test-Path "node_modules")) {
    Write-Host "📦 Installing frontend dependencies..." -ForegroundColor Yellow
    npm install
}

Write-Host ""
Write-Host "🚀 Starting services..." -ForegroundColor Green
Write-Host ""

# Start Twitter Scraper (in new window)
Write-Host "1️⃣  Starting Twitter Scraper..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD\Models'; python twitter_scraper.py"

# Wait a bit
Start-Sleep -Seconds 2

# Start Gemini API Server (in new window)
Write-Host "2️⃣  Starting Gemini API Server..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD\Models'; python gemini.py"

# Wait a bit
Start-Sleep -Seconds 2

# Start Backend Server (in new window)
Write-Host "3️⃣  Starting Backend Server..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD\Backend'; npm run dev"

# Wait a bit
Start-Sleep -Seconds 3

# Start Frontend Server (in new window)
Write-Host "4️⃣  Starting Frontend Server..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD'; npm run dev"

Write-Host ""
Write-Host "✅ All services started!" -ForegroundColor Green
Write-Host ""
Write-Host "Services running:" -ForegroundColor Yellow
Write-Host "  • Twitter Scraper: Running in background (updates every hour)" -ForegroundColor White
Write-Host "  • Gemini API: http://localhost:5001" -ForegroundColor White
Write-Host "  • Backend API: http://localhost:5000" -ForegroundColor White
Write-Host "  • Frontend: http://localhost:5173" -ForegroundColor White
Write-Host ""
Write-Host "🌐 Open your browser and go to: http://localhost:5173" -ForegroundColor Green
Write-Host ""
Write-Host "Press any key to exit (services will continue running)..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
