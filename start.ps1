# TrustForge - One-click startup script (PowerShell)
# SIH26188 | MHA / SSB Police-II Division

Write-Host ""
Write-Host " ===============================================" -ForegroundColor Cyan
Write-Host "  TRUSTFORGE - Intelligent Identity Verification" -ForegroundColor Cyan
Write-Host "  SIH26188 | MHA / SSB Police-II Division" -ForegroundColor Cyan
Write-Host " ===============================================" -ForegroundColor Cyan
Write-Host ""

# Step 1: Kill anything on ports 5001 and 3000
Write-Host "[1/3] Clearing ports 5001 and 3000..." -ForegroundColor Yellow
$ports = @(5001, 3000)
foreach ($port in $ports) {
    $pids = netstat -ano | Select-String ":$port " | Where-Object { $_ -match "LISTENING" } | ForEach-Object {
        ($_ -split '\s+')[-1]
    }
    foreach ($p in $pids) {
        if ($p -match '^\d+$') {
            Stop-Process -Id $p -Force -ErrorAction SilentlyContinue
            Write-Host "    Killed PID $p on port $port" -ForegroundColor Gray
        }
    }
}
Write-Host "    Ports cleared." -ForegroundColor Green
Write-Host ""

# Step 2: Start Backend
Write-Host "[2/3] Starting Backend API on http://localhost:5001 ..." -ForegroundColor Yellow
$backendPath = Join-Path $PSScriptRoot "backend"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$backendPath'; npm run dev" -WindowStyle Normal
Start-Sleep -Seconds 4
Write-Host "    Backend started." -ForegroundColor Green
Write-Host ""

# Step 3: Start Frontend
Write-Host "[3/3] Starting Frontend UI on http://localhost:3000 ..." -ForegroundColor Yellow
$frontendPath = Join-Path $PSScriptRoot "frontend"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$frontendPath'; npm run dev" -WindowStyle Normal
Start-Sleep -Seconds 3
Write-Host "    Frontend started." -ForegroundColor Green
Write-Host ""

Write-Host " ===============================================" -ForegroundColor Cyan
Write-Host "  Application is starting up!" -ForegroundColor Cyan
Write-Host ""
Write-Host "  Frontend  : http://localhost:3000" -ForegroundColor White
Write-Host "  Backend   : http://localhost:5001/api" -ForegroundColor White
Write-Host ""
Write-Host "  Login Credentials:" -ForegroundColor White
Write-Host "    Officer ID : TF-1024" -ForegroundColor Green
Write-Host "    Password   : demo123" -ForegroundColor Green
Write-Host " ===============================================" -ForegroundColor Cyan
Write-Host ""
Write-Host " Opening browser in 5 seconds..." -ForegroundColor Yellow
Start-Sleep -Seconds 5
Start-Process "http://localhost:3000"
