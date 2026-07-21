@echo off
title Happy Buddy - iPad server
cd /d "%~dp0"

echo.
echo  ========================================
echo   Chacha's Happy Buddy - iPad server
echo  ========================================
echo.

set PORT=8080

REM Prefer Python
where python >nul 2>&1
if %ERRORLEVEL%==0 (
  echo  Starting with Python on port %PORT% ...
  echo.
  for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr /c:"IPv4"') do (
    set IP=%%a
    goto :show
  )
  :show
  set IP=%IP: =%
  echo  On iPad Safari open:
  echo.
  echo     http://%IP%:%PORT%
  echo.
  echo  Then: Share -^> Add to Home Screen
  echo.
  echo  Keep this window open while playing.
  echo  Press Ctrl+C to stop.
  echo.
  python -m http.server %PORT%
  goto :eof
)

where py >nul 2>&1
if %ERRORLEVEL%==0 (
  echo  Starting with py launcher...
  py -m http.server %PORT%
  goto :eof
)

where npx >nul 2>&1
if %ERRORLEVEL%==0 (
  echo  Starting with npx serve...
  npx --yes serve -l %PORT% .
  goto :eof
)

echo  ERROR: Need Python or Node.js to serve the game.
echo  Install Python from https://www.python.org/downloads/
echo  then run this file again.
pause
