@echo off
title TrustForge - SIH26188 Startup
color 0A

echo.
echo  ===============================================
echo   TRUSTFORGE - Intelligent Identity Verification
echo   SIH26188 ^| MHA / SSB Police-II Division
echo  ===============================================
echo.

:: Kill any existing node processes on our ports
echo [1/3] Clearing ports 5001 and 3000...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":5001" ^| findstr "LISTENING"') do (
    taskkill /PID %%a /F >nul 2>&1
)
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":3000" ^| findstr "LISTENING"') do (
    taskkill /PID %%a /F >nul 2>&1
)
echo     Ports cleared.
echo.

:: Start Backend
echo [2/3] Starting Backend API on http://localhost:5001 ...
start "TrustForge Backend" cmd /k "cd /d %~dp0backend && npm run dev"
timeout /t 4 /nobreak >nul

:: Start Frontend
echo [3/3] Starting Frontend UI on http://localhost:3000 ...
start "TrustForge Frontend" cmd /k "cd /d %~dp0frontend && npm run dev"
timeout /t 5 /nobreak >nul

echo.
echo  ===============================================
echo   Application is starting up!
echo.
echo   Frontend  : http://localhost:3000
echo   Backend   : http://localhost:5001/api
echo.
echo   Login Credentials:
echo     Officer ID : TF-1024
echo     Password   : demo123
echo  ===============================================
echo.
echo  Opening browser in 5 seconds...
timeout /t 5 /nobreak >nul
start "" "http://localhost:3000"
