#!/bin/bash

echo "🚀 Digital Existence Platform - Storage Setup"
echo "=============================================="

# Check if environment variables are set
if [ -z "$POSTGRES_PRISMA_URL" ] && [ -z "$DATABASE_URL" ]; then
    echo "❌ Database URL not set. Please create Neon Postgres database first."
    echo "   1. Go to Vercel Dashboard > Your Project > Storage"
    echo "   2. Browse Marketplace > Select Neon"
    echo "   3. Create Postgres Database"
    echo "   4. Create Blob Storage"
    echo "   5. Run: vercel env pull .env.local"
    exit 1
fi

if [ -z "$BLOB_READ_WRITE_TOKEN" ]; then
    echo "❌ BLOB_READ_WRITE_TOKEN not set. Please create Vercel Blob storage first."
    echo "   1. Go to Vercel Dashboard > Your Project > Storage"
    echo "   2. Create Blob Storage"
    echo "   3. Run: vercel env pull .env.local"
    exit 1
fi

echo "✅ Database connection configured"
echo "✅ Blob storage configured"

# Generate Prisma client
echo "📦 Generating Prisma client..."
npx prisma generate

# Push schema to database
echo "🗄️  Pushing database schema..."
npx prisma db push

echo "✅ Storage setup complete!"
echo ""
echo "🧪 Testing storage connections..."

# Test database connection
node -e "
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
prisma.\$connect()
  .then(() => console.log('✅ Database connected successfully'))
  .catch(err => console.error('❌ Database connection failed:', err.message))
  .finally(() => prisma.\$disconnect());
" 2>/dev/null

# Test blob storage
node -e "
const { put } = require('@vercel/blob');
put('test/setup-test.txt', 'Storage setup test at ' + new Date().toISOString(), { access: 'public' })
  .then(() => console.log('✅ Blob storage working'))
  .catch(err => console.error('❌ Blob storage failed:', err.message));
" 2>/dev/null

echo ""
echo "🔗 Next steps:"
echo "   1. Set up OAuth providers (see OAUTH_SETUP.md)"
echo "   2. Test authentication flow"
echo "   3. Test research functionality"