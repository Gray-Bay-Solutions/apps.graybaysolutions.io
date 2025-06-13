#!/bin/bash

# Graybay Monitoring Deployment Script
# This script helps deploy the Next.js app to production

echo "🚀 Starting deployment process..."
git pull

# 1. Install dependencies
echo "📦 Installing dependencies..."
npm ci --production=false

# 2. Generate Prisma client
echo "🗄️ Generating Prisma client..."
npx prisma generate

# 3. Run database migrations
echo "📊 Running database migrations..."
npx prisma db push

# 4. Build the application
echo "🏗️ Building application..."
npm run build

# 5. Start with PM2 (if installed)
if command -v pm2 &> /dev/null; then
    echo "🔄 Managing with PM2..."
    pm2 delete graybay-monitoring 2>/dev/null || true
    pm2 start ecosystem.config.js
else
    echo "⚠️ PM2 not found. Starting with npm..."
    npm start
fi

echo "✅ Deployment completed!"
echo "🌐 Application should be running on port 4000" 