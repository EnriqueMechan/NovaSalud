@echo off
title Nova Salud - Detener
taskkill /F /IM node.exe /T > nul 2>&1
echo Servidores detenidos.
pause