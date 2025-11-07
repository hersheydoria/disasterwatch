@echo off
REM Start DisasterWatch Public User Frontend
cd /d "%~dp0public user"
echo Starting Public User Frontend on http://localhost:5174...
call npm run dev
pause
