@echo off
echo ========================================================
echo Starting TrustForge AI Microservice (FastAPI on port 8000)
echo ========================================================
py -m pip install -r requirements.txt
py -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload
pause
