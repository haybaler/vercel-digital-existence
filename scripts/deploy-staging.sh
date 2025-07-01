#!/bin/bash

# Deploy to Vercel staging environment
echo "🚀 Deploying to staging environment..."

# Install Vercel CLI if not already installed
if ! command -v vercel &> /dev/null; then
    echo "Installing Vercel CLI..."
    npm install -g vercel
fi

# Deploy to staging
vercel --prod=false --confirm

echo "✅ Staging deployment initiated!"
echo "🔗 Check your deployment status at: https://vercel.com/dashboard"