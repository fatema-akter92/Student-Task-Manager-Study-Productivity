Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "      🎓 STUDENT TASK MANAGER - FULL STACK RUNNER" -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path

# 1. Start Django
Write-Host "[1/2] Starting Django REST Backend on http://127.0.0.1:8000..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$scriptDir\backend'; python manage.py migrate; python manage.py runserver 8000"

Start-Sleep -Seconds 2

# 2. Start React Vite
Write-Host "[2/2] Starting React Frontend on http://localhost:5173..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$scriptDir\frontend'; npm.cmd run dev"

Start-Sleep -Seconds 3

# Open Browser
Start-Process "http://localhost:5173"

Write-Host "Both servers launched successfully!" -ForegroundColor Cyan
Write-Host "Frontend: http://localhost:5173"
Write-Host "API:      http://127.0.0.1:8000/api/tasks/"
