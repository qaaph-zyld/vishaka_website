@echo off
setlocal

REM Check if .env exists
if not exist .env (
    echo Error: .env file not found. Please run setup-dev.bat first.
    pause
    exit /b 1
)

REM Start the development environment using PowerShell
powershell -ExecutionPolicy Bypass -File "%~dp0start-dev.ps1"

REM Keep the window open if there was an error
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo There was an error starting the development environment.
    pause
)
