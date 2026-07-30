@echo off
cd /d "%~dp0"
title Deploy Realm of Qimen

echo Deploying the latest Realm of Qimen changes...
echo.
call work\push.cmd

echo.
if errorlevel 1 (
  echo Deployment could not be started. Please leave this window open and send Codex a screenshot.
) else (
  echo Done. GitHub received the changes and Vercel will deploy them automatically.
)
echo.
pause
