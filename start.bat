@echo off
echo ==============================================
echo        Starting LocalMind Offline AI
echo ==============================================

echo [1/3] Checking dependencies...
rem Simple ping to local ollama instance
curl -s http://localhost:11434 > NUL
if %ERRORLEVEL% NEQ 0 (
    echo WARNING: Ollama is not running on localhost:11434. 
    echo Please make sure Ollama is installed and running before uploading files.
)

echo [2/3] Booting FastAPI Data Engine...
cd backend
if not exist "venv" (
    echo "Creating virtual environment..."
    python -m venv venv
    call .\venv\Scripts\activate
    pip install -r requirements.txt
) else (
    call .\venv\Scripts\activate
)
start "LocalMind Backend" cmd /k "uvicorn main:app --host 0.0.0.0 --reload"
cd ..

echo [3/3] Booting Next.js UI Application...
cd frontend
if not exist "node_modules" (
    echo "Installing frontend dependencies..."
    call npm install
)
start "LocalMind Frontend" cmd /k "npm run dev -- -H 0.0.0.0"
cd ..

echo ==============================================
echo Setup Complete!
echo Backend API is available at: http://localhost:8000
echo Frontend UI is available at: http://localhost:3000
echo ==============================================
pause
