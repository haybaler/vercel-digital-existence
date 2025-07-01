#!/bin/bash

echo "🚀 Digital Existence Platform - Database Setup"
echo "=============================================="

# Check if environment variables are set
if [ -z "$POSTGRES_URL" ]; then
    echo "❌ POSTGRES_URL not set. Please create Vercel Postgres database first."
    echo "   1. Go to Vercel Dashboard > Your Project > Storage"
    echo "   2. Create Postgres Database"
    echo "   3. Copy environment variables to your .env.local"
    exit 1
fi

echo "✅ Database connection configured"

# Generate Prisma client
echo "📦 Generating Prisma client..."
npx prisma generate

# Push schema to database
echo "🗄️  Pushing database schema..."
npx prisma db push

echo "✅ Database setup complete!"
echo ""
echo "🔗 Next steps:"
echo "   1. Set up OAuth providers"
echo "   2. Test authentication flow"
echo "   3. Test research functionality"