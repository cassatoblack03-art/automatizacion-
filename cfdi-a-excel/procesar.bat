@echo off
chcp 65001 >nul
cd /d "%~dp0"
where py >nul 2>nul
if %errorlevel%==0 (set PY=py) else (set PY=python)
%PY% -m pip install -q --disable-pip-version-check -r requirements.txt
%PY% cfdi_a_excel.py --abrir
echo.
pause
