@echo off
title Product Spec Evaluator & AI Tender Agency Server
cd /d "%~dp0"
echo ======================================================================
echo   Starting Brihaspathi Technologies Product Spec Evaluator AI Server
echo   Permanent Local Dev Server Running on http://localhost:3000
echo ======================================================================
npm run dev -- --host 0.0.0.0 --port 3000
pause
