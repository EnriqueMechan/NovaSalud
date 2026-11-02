@echo off
:: Nova Salud - Detener servidores (Windows)
title Nova Salud - Detener
taskkill /F /IM node.exe /T > nul 2>&1
echo.
echo Servidores de Nova Salud detenidos.
echo.
pause