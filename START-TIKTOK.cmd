@echo off
chcp 65001 >nul
cd /d "%~dp0"
set "TIKTOK_USERNAME=hailen1113"
set /p "TIKTOK_USERNAME=Username TikTok [hailen1113] - Enter de giu: "
where node >nul 2>nul
if errorlevel 1 (
  echo Can cai Node.js 20 tro len va chay npm install trong thu muc game.
  pause
  exit /b 1
)
node bridge.mjs
pause
