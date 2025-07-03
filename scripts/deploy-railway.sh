#!/bin/bash

echo "🚀 Deploying to Railway..."

# Check if Railway CLI is installed
if ! command -v railway &> /dev/null; then
    echo "❌ Railway CLI not found. Installing..."
    npm install -g @railway/cli
fi

# Login to Railway (will prompt if not logged in)
railway login

# Set deployment platform environment variable
railway variables set DEPLOYMENT_PLATFORM=railway

# Deploy to Railway
railway up

echo "✅ Deployment to Railway completed!"
echo "🌐 Your app will be available at your Railway domain"
echo "📝 Don't forget to:"
echo "   - Set up your environment variables in Railway dashboard"
echo "   - Run database migrations: railway run npx prisma migrate deploy"
echo "   - Add your custom domain if needed"