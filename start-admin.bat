@echo off
REM Start DisasterWatch Admin Frontend
cd /d "%~dp0admin"
echo Starting Admin Frontend on http://localhost:5173...
call npm run dev
pause
