# Storage Setup Guide

## 🗄️ Vercel Storage Components

This platform uses two storage types:
- **Postgres Database**: User data, research sessions, trends metadata  
- **Blob Storage**: Research reports, generated content, file uploads

## Creating Neon Postgres Database

**Recommended**: Use Neon for serverless Postgres with zero cold starts.

### Step 1: Create Neon Database
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Navigate to your project: `vercel-digital-existence`
3. Click on **Storage** tab
4. Click **Browse Marketplace**
5. Select **Neon - Serverless Postgres**
6. Click **Add Integration**
7. Name: `digital-existence-db`
8. Region: Choose closest to your users
9. Click **Create Database**

### Step 2: Create Blob Storage
1. In the same **Storage** tab, click **Create Database** again
2. Select **Blob**  
3. Name: `digital-existence-blob`
4. Click **Create**

### Step 3: Get Connection Strings
After both databases are created:
1. Go to **Settings** → **Environment Variables**
2. You should see these auto-added:

   ```bash
   # Neon Postgres
   DATABASE_URL
   POSTGRES_PRISMA_URL
   POSTGRES_URL_NON_POOLING
   
   # Blob Storage
   BLOB_READ_WRITE_TOKEN
   ```

### Step 4: Update Local Environment
```bash
# Pull the latest environment variables
vercel env pull .env.local
```

### Step 5: Run Database Migration
```bash
# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:push

# Optional: Open Prisma Studio to view data
npm run db:studio
```

### Step 6: Verify Storage Setup
```bash
# Test database connection
node -e "
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
prisma.\$connect()
  .then(() => console('✅ Database connected successfully'))
  .catch(err => console.error('❌ Database connection failed:', err))
  .finally(() => prisma.\$disconnect());
"

# Test blob storage
node -e "
const { put } = require('@vercel/blob');
put('test.txt', 'Hello Blob!', { access: 'public' })
  .then(() => console('✅ Blob storage working'))
  .catch(err => console.error('❌ Blob storage failed:', err));
"
```

## 🔄 Alternative: Quick Setup Script

I've prepared a setup script that will handle this once you have the database:

```bash
# Make the script executable
chmod +x scripts/setup-database.sh

# Run the setup
./scripts/setup-database.sh
```

## 🚨 Troubleshooting

**Problem**: `DATABASE_URL` not found
- **Solution**: Make sure you've created the Neon database in Vercel Dashboard and pulled env vars

**Problem**: Schema push fails
- **Solution**: Check your database connection string format

**Problem**: Prisma client not found
- **Solution**: Run `npm run db:generate` first

---

**Next Steps After Database Setup:**
1. Test authentication flow
2. Set up OAuth providers
3. Test research functionality