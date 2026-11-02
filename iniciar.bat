@echo off
:: Nova Salud - Lanzador general (Windows)
:: Levanta backend (puerto 4000) y frontend (puerto 5173) en cualquier dispositivo.
setlocal EnableDelayedExpansion

set "ROOT_DIR=%~dp0"
set "BACKEND_DIR=%ROOT_DIR%backend"
set "FRONTEND_DIR=%ROOT_DIR%frontend"
set "BACKEND_PORT=4000"
set "FRONTEND_PORT=5173"
set "FRONTEND_URL=http://localhost:%FRONTEND_PORT%"

echo.
echo ================================================
echo   Nova Salud - Servidores en línea (Windows)
echo ================================================
echo.

:: --- requisitos -------------------------------------------------------------
where node >nul 2>&1
if errorlevel 1 (
    echo ERROR: No se encontró node. Instala Node.js desde https://nodejs.org
    pause
    exit /b 1
)
where npm >nul 2>&1
if errorlevel 1 (
    echo ERROR: No se encontró npm.
    pause
    exit /b 1
)

:: --- instalar dependencias si faltan ----------------------------------------
if not exist "%BACKEND_DIR%\node_modules" (
    echo Instalando dependencias del backend...
    cd /d "%BACKEND_DIR%" && npm install --no-fund --no-audit
    if errorlevel 1 (
        echo ERROR: Fallo al instalar dependencias del backend
        pause
        exit /b 1
    )
)
if not exist "%FRONTEND_DIR%\node_modules" (
    echo Instalando dependencias del frontend...
    cd /d "%FRONTEND_DIR%" && npm install --no-fund --no-audit
    if errorlevel 1 (
        echo ERROR: Fallo al instalar dependencias del frontend
        pause
        exit /b 1
    )
)

:: --- seed de la base de datos ----------------------------------------------
echo Ejecutando seed de la base de datos...
cd /d "%BACKEND_DIR%" && npm run seed >nul 2>&1
if errorlevel 1 (
    echo Aviso: seed omitido (ya ejecutado o sin cambios).
) else (
    echo Seed completado.
)

:: --- detener previos --------------------------------------------------------
call :detener_previos

:: --- lanzar backend ---------------------------------------------------------
echo Iniciando backend en puerto %BACKEND_PORT%...
start "NovaSalud Backend" /d "%BACKEND_DIR%" cmd /c "npm run dev > "%ROOT_DIR%.novasalud-backend.log" 2>&1"

:: --- lanzar frontend --------------------------------------------------------
echo Iniciando frontend en puerto %FRONTEND_PORT%...
start "NovaSalud Frontend" /d "%FRONTEND_DIR%" cmd /c "npm run dev > "%ROOT_DIR%.novasalud-frontend.log" 2>&1"

:: --- esperar a que respondan ------------------------------------------------
echo Esperando a que los servicios estén listos...
set /a intentos=0
:wait_backend
powershell -command "Test-NetConnection -ComputerName localhost -Port %BACKEND_PORT% -InformationLevel Quiet" >nul 2>&1
if errorlevel 1 (
    set /a intentos+=1
    if !intentos! gtr 60 (
        echo Aviso: no se detectó respuesta del backend en puerto %BACKEND_PORT%.
    ) else (
        timeout /t 1 >nul
        goto wait_backend
    )
)
echo Backend listo en puerto %BACKEND_PORT%.

set /a intentos=0
:wait_frontend
powershell -command "Test-NetConnection -ComputerName localhost -Port %FRONTEND_PORT% -InformationLevel Quiet" >nul 2>&1
if errorlevel 1 (
    set /a intentos+=1
    if !intentos! gtr 60 (
        echo Aviso: no se detectó respuesta del frontend en puerto %FRONTEND_PORT%.
    ) else (
        timeout /t 1 >nul
        goto wait_frontend
    )
)
echo Frontend listo en puerto %FRONTEND_PORT%.

:: --- abrir navegador --------------------------------------------------------
echo Abriendo %FRONTEND_URL%...
start "" "%FRONTEND_URL%"

:: --- resumen ----------------------------------------------------------------
echo.
echo ================================================
echo   Nova Salud - Listo
echo ================================================
echo   Backend  : http://localhost:%BACKEND_PORT%
echo   Frontend  : %FRONTEND_URL%
echo   Credenciales:
echo     admin@novasalud.com   / admin123
echo     vendedor@novasalud.com / vendedor123
echo ================================================
echo   Logs:
echo     backend  : %ROOT_DIR%.novasalud-backend.log
echo     frontend : %ROOT_DIR%.novasalud-frontend.log
echo.
echo   Para detener todo: ejecutar detener.bat
echo ================================================
echo.
goto :eof

:detener_previos
taskkill /F /IM node.exe /T >nul 2>&1
exit /b 0