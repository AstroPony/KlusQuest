@echo off
echo 🚀 KlusQuest Development Setup
echo ==============================

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js 20+ first.
    pause
    exit /b 1
)

echo ✅ Node.js detected

REM Install dependencies
echo 📦 Installing dependencies...
call npm install

REM Generate Prisma client
echo 🔧 Generating Prisma client...
call npx prisma generate

REM Run database migration
echo 🗄️  Setting up database...
call npx prisma migrate dev --name init

REM Seed database
echo 🌱 Seeding database...
call npx tsx prisma/seed.ts

echo.
echo 🎉 Setup complete! You can now run:
echo    npm run dev
echo.
echo 📱 Open http://localhost:3000 in your browser
echo 🎮 Try the Kid View at http://localhost:3000/kid
echo 📊 Check the Dashboard at http://localhost:3000/dashboard
pause 