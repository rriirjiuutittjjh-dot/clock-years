@echo off
title Clock Years - Cloudflare tunnel
rem Free public HTTPS for your Windows 24/7 box. Run start-windows.bat FIRST,
rem then double-click this. It prints a https://....trycloudflare.com URL.
rem That URL changes on every restart - for a stable domain see WINDOWS.md.
cd /d "%~dp0"

if not exist cloudflared.exe (
  echo [+] Downloading cloudflared (first run only)...
  curl -L -o cloudflared.exe https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-windows-amd64.exe
  if errorlevel 1 (
    echo [x] Download failed. Check your connection and re-run.
    pause
    exit /b 1
  )
)

echo [+] Starting free tunnel to http://localhost:8080 ...
echo     Leave this window open. Your public URL appears below.
cloudflared.exe tunnel --url http://localhost:8080
pause
