@echo off
title StudyWeb One-Click Starter

echo ==========================================
echo    StudyWeb Learning Platform - Assistant
echo ==========================================
echo.

:: Check for Node.js/npm environment
echo [0/2] Checking for Node.js environment...
where npm >nul 2>nul
if %errorlevel% neq 0 goto INSTALL_NODE
echo Found npm version: 
call npm -v
echo.
goto CHECK_DEPENDENCIES

:INSTALL_NODE
echo [MISSING] Node.js/npm NOT found!
echo [ACTION] Attempting to install Node.js automatically via Winget...
echo.
winget --version >nul 2>nul
if %errorlevel% neq 0 goto WINGET_MISSING

echo [1/2] Installing Node.js LTS version...
winget install -e --id OpenJS.NodeJS.LTS --silent --accept-package-agreements --accept-source-agreements
if %errorlevel% equ 0 (
    echo.
    echo [SUCCESS] Node.js installed! 
    echo [IMPORTANT] Please CLOSE this window and RUN this script again to refresh environment.
    pause
    exit
) else (
    echo [ERROR] Automated installation failed.
)
goto MANUAL_INSTALL

:WINGET_MISSING
echo [ERROR] Winget not found. Cannot install automatically.
goto MANUAL_INSTALL

:MANUAL_INSTALL
echo.
echo Please install Node.js manually from https://nodejs.org/
pause
exit

:CHECK_DEPENDENCIES
:: Check dependencies
if not exist "%~dp0server\node_modules\" (
    echo [Install] Installing backend dependencies, please wait...
    cd /d "%~dp0server" && call npm install
)

if not exist "%~dp0client\node_modules\" (
    echo [Install] Installing frontend dependencies, please wait...
    cd /d "%~dp0client" && call npm install
)

:: Start Backend
echo [1/2] Starting backend service (Port: 3001)...
start "StudyWeb-Backend" /min cmd /c "cd /d %~dp0server && npm start"

:: Wait for startup
timeout /t 3 /nobreak > nul

:: Start Frontend
echo [2/2] Starting frontend development environment...
start "StudyWeb-Frontend" cmd /c "cd /d %~dp0client && npm run dev"

echo.
echo ==========================================
echo Services started in background windows!
echo.
echo  - Backend: http://localhost:3001
echo  - Frontend: Check the new terminal window (usually http://localhost:5173)
echo.
echo Tips:
echo 1. To stop, close the terminal windows.
echo 2. Make sure local Ollama service is running for LLM features.
echo ==========================================
echo.
pause
