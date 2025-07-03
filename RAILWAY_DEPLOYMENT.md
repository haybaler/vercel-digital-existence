# Deploy to Railway - Step by Step Guide

Railway is the best alternative to Vercel for your Digital Existence Platform. Here's how to deploy:

## 🚀 One-Click Deploy

[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/template/your-template)

## 📋 Manual Setup

### 1. Sign Up & Connect Repository
1. Go to [railway.app](https://railway.app) and sign up
2. Click "New Project" → "Deploy from GitHub repo"
3. Connect your GitHub account and select this repository
4. Railway will auto-detect Next.js and configure build settings

### 2. Add PostgreSQL Database
1. In your Railway project dashboard, click "New"
2. Select "Database" → "Add PostgreSQL"
3. Railway will create a database and provide connection details
4. The `DATABASE_URL` environment variable is automatically set

### 3. Configure Environment Variables
In Railway dashboard → Variables tab, add:

```bash
# NextAuth.js (Required)
NEXTAUTH_URL=https://your-app.railway.app
NEXTAUTH_SECRET=your-generated-secret-32-chars-min

# AI Services
OPENAI_API_KEY=your-openai-api-key
ANTHROPIC_API_KEY=your-anthropic-api-key

# OAuth Providers (Optional but recommended)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret

# Firecrawl (Already configured)
FIRECRAWL_API_KEY=fc-5544ea8ccbfb40eabc986617eda4d6e3

# Platform identifier
DEPLOYMENT_PLATFORM=railway

# Search API for trends (Optional)
SEARCH_API_KEY=your-search-api-key
```

### 4. Run Database Migrations
Once deployed, run migrations:
1. Go to your Railway project
2. Click on your app service
3. Go to "Settings" → "Variables"
4. Add a new deployment trigger or redeploy
5. Or use Railway CLI: `railway run npx prisma migrate deploy`

### 5. Set Up OAuth Providers

#### Google OAuth
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URI: `https://your-app.railway.app/api/auth/callback/google`

#### GitHub OAuth
1. Go to GitHub Settings → Developer settings → OAuth Apps
2. Create new OAuth App
3. Set Homepage URL: `https://your-app.railway.app`
4. Set Authorization callback URL: `https://your-app.railway.app/api/auth/callback/github`

### 6. Custom Domain (Optional)
1. In Railway dashboard → Settings → Environment
2. Click "Add Custom Domain"
3. Enter your domain name
4. Update your DNS records as instructed
5. Update `NEXTAUTH_URL` to your custom domain

## ⚡ Railway CLI Setup (Optional)

Install Railway CLI for easier management:

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login to Railway
railway login

# Link to your project
railway link

# Run commands in Railway environment
railway run npm run build
railway run npx prisma migrate deploy
railway run npx prisma db seed

# View logs
railway logs

# Open project in browser
railway open
```

## 📊 Monitoring & Scaling

### Built-in Monitoring
- Railway provides automatic monitoring
- View metrics in the Dashboard → Metrics tab
- Set up alerts for high CPU/memory usage

### Scaling
- Railway auto-scales based on traffic
- Configure scaling limits in Settings → Deploy
- Upgrade plan for higher limits

### Database Management
- Use Railway's built-in database dashboard
- Or connect with external tools using connection string
- Automatic backups included in paid plans

## 💰 Pricing

- **Hobby Plan**: $5/month
  - 512MB RAM
  - 1GB disk
  - Shared CPU
  - Perfect for MVP/testing

- **Pro Plan**: $20/month
  - 8GB RAM
  - 100GB disk
  - Dedicated vCPU
  - Production-ready

## 🔧 Troubleshooting

### Build Failures
- Check build logs in Railway dashboard
- Ensure all environment variables are set
- Verify `package.json` dependencies

### Database Connection Issues
- Verify `DATABASE_URL` is automatically set by Railway
- Check database service is running
- Run migrations: `railway run npx prisma migrate deploy`

### OAuth Issues
- Ensure redirect URIs match exactly
- Check that `NEXTAUTH_URL` is set correctly
- Verify OAuth client secrets are correct

## 🚀 Post-Deployment

Once deployed, your app will be available at:
- `https://your-app.railway.app`
- Custom domain if configured

### Features Ready to Use:
- ✅ User authentication with Google/GitHub
- ✅ Research engine with Firecrawl
- ✅ AI content generation (with OpenAI key)
- ✅ Trend monitoring
- ✅ Digital existence scoring
- ✅ Real-time notifications

### Next Steps:
1. Add your OpenAI API key for full AI features
2. Set up OAuth providers for user authentication
3. Configure custom domain
4. Set up monitoring alerts
5. Scale as needed

## 🆘 Need Help?

- [Railway Documentation](https://docs.railway.app/)
- [Railway Discord Community](https://discord.gg/railway)
- Check the main `DEPLOYMENT_OPTIONS.md` for other platforms