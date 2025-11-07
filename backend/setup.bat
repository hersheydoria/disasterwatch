@echo off
cd c:\Users\User\OneDrive\Desktop\web\disasterwatch\backend
echo Installing Django backend dependencies...
python -m pip install -r requirements.txt
echo.
echo Installation complete!
echo.
echo Running migrations...
python manage.py migrate
echo.
echo Creating superuser (optional - you can skip this)...
python manage.py createsuperuser
echo.
echo Setup complete! You can now run the server with:
echo python manage.py runserver
echo.
echo The API will be available at http://localhost:8000/api/
pause
