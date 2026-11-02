@echo off
title Nova Salud - Lanzador
cd /d "%~dp0"

echo Iniciando backend...
start "NovaSalud Backend" cmd /k "cd /d "%~dp0backend" && npm run dev"

echo Iniciando frontend...
start "NovaSalud Frontend" cmd /k "cd /d "%~dp0frontend" && npm run dev"

echo Esperando a que el frontend este listo...
timeout /t 8 /nobreak > nul

start "" "http://localhost:5173"

echo Lanzador completado. Puede cerrar esta ventana.
pause