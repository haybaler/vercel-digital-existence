#!/bin/bash

# Deploy to Vercel production environment
echo "🚀 Deploying to production environment..."

# Install Vercel CLI if not already installed
if ! command -v vercel &> /dev/null; then
    echo "Installing Vercel CLI..."
    npm install -g vercel
fi

# Deploy to production
vercel --prod --confirm

echo "✅ Production deployment initiated!"
echo "🔗 Check your deployment status at: https://vercel.com/dashboard"