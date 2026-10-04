@echo off
title AnumatiSetu - Compliance Platform
echo ========================================================
echo   AnumatiSetu - Business Compliance & Statutory Approvals
echo ========================================================
echo.
echo Starting Node.js backend server on http://localhost:4000 ...
cd /d "%~dp0"

echo Opening browser at http://localhost:4000 ...
start http://localhost:4000

node backend/server.js
pause
