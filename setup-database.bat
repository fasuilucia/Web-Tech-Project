@echo off
echo ========================================
echo Attendance Monitoring - Database Setup
echo ========================================
echo.

REM Prompt for PostgreSQL password
set /p PGPASSWORD="Enter PostgreSQL password for user 'postgres': "

echo.
echo Creating database 'attendance_monitoring'...
echo.

REM Create database using psql
psql -U postgres -c "CREATE DATABASE attendance_monitoring;" 2>nul

if %ERRORLEVEL% EQU 0 (
    echo ✓ Database created successfully!
) else (
    echo Database might already exist or there was an error.
    echo Please check manually using pgAdmin.
)

echo.
echo ========================================
echo Setup Complete!
echo ========================================
echo.
echo Next steps:
echo 1. Configure backend/.env file
echo 2. Run: cd backend
echo 3. Run: npm run migrate
echo.
pause
