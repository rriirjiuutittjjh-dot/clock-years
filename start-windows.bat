@echo off
title Clock Years
rem One-click launcher: install -^> build -^> migrate -^> serve on http://localhost:8080
cd /d "%~dp0"

where node >nul 2>nul
if errorlevel 1 (
  echo [x] Node.js not found. Install Node 22 LTS from https://nodejs.org, then re-run.
  pause
  exit /b 1
)

if not exist node_modules (
  echo [+] Installing dependencies (first run only)...
  call npm install
  if errorlevel 1 (
    echo [x] npm install failed.
    pause
    exit /b 1
  )
)

if not exist .env (
  echo [+] Creating .env from .env.example (defaults work on this PC).
  copy /y .env.example .env >nul
)

if not exist .output\server\index.mjs (
  echo [+] Building the production server (first run only)...
  set NITRO_PRESET=node-server
  call npm run build
  if errorlevel 1 (
    echo [x] Build failed.
    pause
    exit /b 1
  )
)

echo [+] Starting Clock Years on http://localhost:8080 ...
start "" http://localhost:8080
call npm start
pause
