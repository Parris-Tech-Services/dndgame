@echo off
setlocal

set "ROOT=%~dp0"
set "URL=http://127.0.0.1:8765/index.html"

powershell -NoProfile -ExecutionPolicy Bypass -Command "try { Invoke-WebRequest -UseBasicParsing -Uri '%URL%' -TimeoutSec 2 | Out-Null; exit 0 } catch { exit 1 }"
if errorlevel 1 (
  start "dndgame-server" /min cmd /c "cd /d ""%ROOT%"" && python -m http.server 8765 --bind 127.0.0.1"
  timeout /t 2 /nobreak >nul
)

start "" "%URL%"
