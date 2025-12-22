@echo off
echo Starting LinkedIn Engagement Agent...
echo ====================================
echo.

:: Check if .env exists
if not exist .env (
    echo Error: .env file not found!
    echo Please create a .env file with LINKEDIN_EMAIL, LINKEDIN_PASSWORD, and OPENAI_API_KEY.
    pause
    exit /b
)

:: Run the python script
python engagement_agent.py --max 10 --safe-mode

echo.
echo ====================================
echo Agent finished.
pause
