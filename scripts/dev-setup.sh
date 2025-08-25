#!/bin/bash

echo "🚀 KlusQuest Development Setup"
echo "=============================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 20+ first."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 20 ]; then
    echo "❌ Node.js version 20+ is required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js $(node -v) detected"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Generate Prisma client
echo "🔧 Generating Prisma client..."
npx prisma generate

# Run database migration
echo "🗄️  Setting up database..."
npx prisma migrate dev --name init

# Seed database
echo "🌱 Seeding database..."
npx tsx prisma/seed.ts

echo ""
echo "🎉 Setup complete! You can now run:"
echo "   npm run dev"
echo ""
echo "📱 Open http://localhost:3000 in your browser"
echo "🎮 Try the Kid View at http://localhost:3000/kid"
echo "📊 Check the Dashboard at http://localhost:3000/dashboard" 