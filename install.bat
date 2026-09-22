@echo off
echo.
echo  ====================================
echo   Parfum Shop - Installation
echo  ====================================
echo.

echo [1/3] Installation des dependances backend...
cd backend
call npm install
echo.

echo [2/3] Installation des dependances frontend...
cd ..\frontend
call npm install
echo.

echo [3/3] Initialisation de la base de donnees...
cd ..\backend
call npm run seed
echo.

echo  ====================================
echo   Installation terminee !
echo  ====================================
echo.
echo  Pour demarrer le projet :
echo  - Backend  : cd backend  ^& npm run dev
echo  - Frontend : cd frontend ^& npm run dev
echo.
pause
