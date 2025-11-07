@echo off
REM Start all DisasterWatch services
echo.
echo ========================================
echo DisasterWatch - Complete Startup
echo ========================================
echo.
echo This will start 3 services in separate windows:
echo 1. Django Backend (http://localhost:8000)
echo 2. Admin Frontend (http://localhost:5173)
echo 3. Public User Frontend (http://localhost:5174)
echo.
echo ========================================
echo.

REM Start Backend
echo Starting Django Backend...
start "DisasterWatch Backend" cmd /k "cd /d "%~dp0backend" && python manage.py runserver"
timeout /t 2 /nobreak

REM Start Admin Frontend
echo Starting Admin Frontend...
start "DisasterWatch Admin" cmd /k "cd /d "%~dp0admin" && npm run dev"
timeout /t 2 /nobreak

REM Start Public User Frontend
echo Starting Public User Frontend...
start "DisasterWatch Public User" cmd /k "cd /d "%~dp0public user" && npm run dev"
timeout /t 2 /nobreak

echo.
echo ========================================
echo All services started!
echo ========================================
echo.
echo Opening applications in browser...
timeout /t 3 /nobreak

start http://localhost:8000/api/
timeout /t 1 /nobreak
start http://localhost:5173
timeout /t 1 /nobreak
start http://localhost:5174

echo.
echo ✓ All services should now be running!
echo.
echo URLs:
echo  - Backend API: http://localhost:8000/api/
echo  - Admin Dashboard: http://localhost:5173
echo  - Public User App: http://localhost:5174
echo.
echo Login Credentials (Admin):
echo  - Username: admin
echo  - Password: admin123
echo.
pause
echo ===============================================
echo   - 2 sample shelters (Agusan del Norte)
echo   - 5 earthquake records (Caraga region)
echo   - 5 safety tips
echo   - 6 coordinator accounts
echo.

echo ===============================================
echo Available Coordinator Accounts:
echo ===============================================
echo   1. admin / admin123 (Administrator)
echo   2. coordinator_butuan / coordinator_butuan123
echo   3. coordinator_agusan_norte / coordinator_agusan_norte123
echo   4. coordinator_surigao_sur / coordinator_surigao_sur123
echo   5. coordinator_agusan_sur / coordinator_agusan_sur123
echo   6. coordinator_cabadbaran / coordinator_cabadbaran123
echo.

echo ===============================================
echo Quick Links:
echo ===============================================
echo   Admin Dashboard: http://localhost:5173/
echo   Public User App: http://localhost:5174/
echo   API: http://localhost:8000/api/
echo   Django Admin: http://localhost:8000/admin/
echo   Shelters API: http://localhost:8000/api/shelters/
echo   Earthquakes API: http://localhost:8000/api/earthquakes/
echo   Alerts API: http://localhost:8000/api/alerts/
echo.

echo ======================================
echo Ready to Start! Open 3 Terminals
echo ======================================
echo.

pause
