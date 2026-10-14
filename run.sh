#!/usr/bin/env bash
echo "=========================================================="
echo "      🎓 STUDENT TASK MANAGER - FULL STACK RUNNER"
echo "=========================================================="

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

echo "[1/2] Starting Django Backend on http://127.0.0.1:8000..."
(cd "$DIR/backend" && python3 manage.py migrate && python3 manage.py runserver 8000) &
DJANGO_PID=$!

sleep 2

echo "[2/2] Starting Vite Frontend on http://localhost:5173..."
(cd "$DIR/frontend" && npm run dev) &
FRONTEND_PID=$!

trap "kill $DJANGO_PID $FRONTEND_PID" EXIT
wait
