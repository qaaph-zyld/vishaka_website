@echo off
setlocal enabledelayedexpansion

REM Check if .env exists and create a backup
if exist .env (
    echo Creating backup of existing .env file...
    copy /Y .env ".env.backup.%date:~-4,4%%date:~-10,2%%date:~-7,2%_%time:~0,2%%time:~3,2%"
)

REM Generate random strings for secrets
set "NEXTAUTH_SECRET=%random%%random%%random%%random%"
set "DB_PASSWORD=Password%random:~0,3%%random:~0,3%"
set "MATOMO_DB_PASSWORD=Matomo%random:~0,3%%random:~0,3%"
set "MATOMO_DB_ROOT_PASSWORD=Root%random:~0,3%%random:~0,3%%random:~0,3%"

REM Create .env file
echo # Database Configuration > .env
echo DB_USER=vishaka >> .env
echo DB_PASSWORD=!DB_PASSWORD! >> .env
echo DB_NAME=vishaka >> .env
echo DATABASE_URL="postgresql://vishaka:!DB_PASSWORD!@localhost:5432/vishaka?schema=public" >> .env
echo DIRECT_URL="postgresql://vishaka:!DB_PASSWORD!@localhost:5432/vishaka?schema=public&connection_limit=1" >> .env
echo. >> .env
echo # Next.js Configuration >> .env
echo NODE_ENV=development >> .env
echo NEXTAUTH_SECRET=!NEXTAUTH_SECRET! >> .env
echo NEXTAUTH_URL=http://localhost:3000 >> .env
echo. >> .env
echo # Matomo Configuration >> .env
echo NEXT_PUBLIC_MATOMO_URL=http://localhost:8080 >> .env
echo NEXT_PUBLIC_MATOMO_SITE_ID=1 >> .env
echo MATOMO_DB_PASSWORD=!MATOMO_DB_PASSWORD! >> .env
echo MATOMO_DB_ROOT_PASSWORD=!MATOMO_DB_ROOT_PASSWORD! >> .env
echo. >> .env
echo # Storage Configuration >> .env
echo UPLOAD_DIR=./uploads >> .env
echo MAX_FILE_SIZE=10485760 >> .env
echo. >> .env
echo # CORS Configuration >> .env
echo NEXT_PUBLIC_ALLOWED_ORIGINS=http://localhost:3000 >> .env

echo Environment configuration created successfully!
echo Please review the generated .env file and update any values as needed.

REM Start Docker services if Docker is available
where docker >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo Starting Docker services...
    docker-compose -f docker-compose.db.yml up -d
    
    echo Waiting for PostgreSQL to be ready...
    :db_not_ready
    docker exec vishaka-db pg_isready -U vishaka >nul 2>&1
    if %ERRORLEVEL% NEQ 0 (
        echo PostgreSQL is not ready yet, waiting...
        timeout /t 5 >nul
        goto db_not_ready
    )
    
    echo PostgreSQL is ready!
    
    echo Initializing database...
    call npm install
    call npx prisma migrate deploy
    call npx prisma generate
    
    echo.
    echo Development environment setup complete!
    echo.
    echo To start the development server, run:
    echo   npm run dev
    echo.
    echo Access the application at: http://localhost:3000
    echo Access Matomo at: http://localhost:8080
) else (
    echo Docker is not installed or not in PATH.
    echo Please install Docker Desktop for Windows and try again.
    echo https://www.docker.com/products/docker-desktop/
)
