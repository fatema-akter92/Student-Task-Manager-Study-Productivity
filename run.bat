@echo off
TITLE Student Task Manager Launcher
echo ==========================================================
echo       🎓 STUDENT TASK MANAGER - FULL STACK RUNNER
echo ==========================================================
echo Starting Django Backend and Vite React Frontend...
echo.

cd /d "%~dp0backend"
echo [1/2] Launching Django REST API Server (http://127.0.0.1:8000)...
start "Student Task Manager - Django API" cmd /k "python manage.py migrate && python manage.py runserver 8000"

timeout /t 2 /nobreak >nul

cd /d "%~dp0frontend"
echo [2/2] Launching React Vite Dev Server (http://localhost:5173)...
start "Student Task Manager - React Frontend" cmd /k "npm.cmd run dev"

timeout /t 3 /nobreak >nul
echo.
echo Opening browser at http://localhost:5173...
start http://localhost:5173

echo.
echo Both servers are running!
echo - React Web App:   http://localhost:5173
echo - Django REST API: http://127.0.0.1:8000/api/tasks/
echo - Django Admin:    http://127.0.0.1:8000/admin/
echo.
pause
