@echo off
REM Run migrations for DisasterWatch Django backend
cd c:\Users\User\OneDrive\Desktop\web\disasterwatch\backend
python manage.py migrate
echo.
echo Migrations complete!
pause
