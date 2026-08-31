#!/usr/bin/env bash
echo "======================================================================"
echo "  NoteFlow AI - Intelligent Speech-to-Study Automation Platform"
echo "======================================================================"
echo ""

# Start backend
echo "[1/2] Starting NoteFlow AI Backend API on http://127.0.0.1:8000 ..."
(cd backend && python run.py) &
BACKEND_PID=$!

# Start frontend
echo "[2/2] Starting NoteFlow AI Frontend on http://localhost:5173 ..."
(cd frontend && npm run dev) &
FRONTEND_PID=$!

echo ""
echo "NoteFlow AI is running!"
echo "Backend: http://127.0.0.1:8000 (Swagger docs at http://127.0.0.1:8000/docs)"
echo "Frontend: http://localhost:5173"
echo "Press Ctrl+C to stop both servers."

trap "kill $BACKEND_PID $FRONTEND_PID" EXIT
wait
