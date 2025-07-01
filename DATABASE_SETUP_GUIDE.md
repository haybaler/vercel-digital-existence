# Database Setup Guide

## 🗄️ Creating Vercel Postgres Database

Since Vercel CLI doesn't directly support creating Postgres databases, you need to use the Vercel Dashboard:

### Step 1: Create Database via Dashboard
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Navigate to your project: `vercel-digital-existence`
3. Click on **Storage** tab
4. Click **Create Database**
5. Select **Postgres**
6. Name: `digital-existence-db`
7. Region: Choose closest to your users
8. Click **Create**

### Step 2: Get Connection Strings
After database creation:
1. Go to **Settings** → **Environment Variables**
2. You should see these auto-added:
   ```
   POSTGRES_DATABASE
   POSTGRES_HOST
   POSTGRES_PASSWORD
   POSTGRES_PRISMA_URL
   POSTGRES_URL
   POSTGRES_URL_NON_POOLING
   POSTGRES_USER
   ```

### Step 3: Update Local Environment
```bash
# Pull the latest environment variables
vercel env pull .env.local
```

### Step 4: Run Database Migration
```bash
# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:push

# Optional: Open Prisma Studio to view data
npm run db:studio
```

### Step 5: Verify Database Setup
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

**Problem**: `POSTGRES_URL` not found
- **Solution**: Make sure you've created the database in Vercel Dashboard and pulled env vars

**Problem**: Schema push fails
- **Solution**: Check your database connection string format

**Problem**: Prisma client not found
- **Solution**: Run `npm run db:generate` first

---

**Next Steps After Database Setup:**
1. Test authentication flow
2. Set up OAuth providers
3. Test research functionality