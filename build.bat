@echo off
echo ==============================================
echo        LocalMind Production Optimizer
echo ==============================================

echo Building Next.js Frontend Framework...
cd frontend
call npm install
call npm run build
cd ..

echo React Static Assets have been compiled successfully!
echo You can now shift into your Docker pipeline.
pause
