@echo off
echo ======================================================================
echo   NoteFlow AI - Intelligent Speech-to-Study Automation Platform
echo ======================================================================
echo.

echo [1/2] Starting NoteFlow AI FastAPI Backend Server on http://127.0.0.1:8000 ...
start "NoteFlow AI Backend" cmd /k "cd /d %~dp0backend && python run.py"

echo [2/2] Starting NoteFlow AI React/Vite Frontend on http://localhost:5173 ...
start "NoteFlow AI Frontend" cmd /k "cd /d %~dp0frontend && npm run dev"

echo.
echo Both Backend (port 8000) and Frontend (port 5173) have been launched!
echo Open your browser to http://localhost:5173 to access NoteFlow AI.
echo ======================================================================
pause
