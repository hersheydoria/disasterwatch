@echo off
REM Start DisasterWatch Django Backend
cd /d "%~dp0backend"
echo Starting Django Backend on http://localhost:8000...
python manage.py runserver
pause
