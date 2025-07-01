# OAuth Providers Setup Guide

## 🔗 Your App URLs
- **Production**: `https://your-app-name.vercel.app`
- **Callback Base**: `https://your-app-name.vercel.app/api/auth/callback`

## 🔐 Google OAuth Setup

1. **Go to**: [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
2. **Create Project** (if needed)
3. **Enable APIs**: Google+ API, Google People API
4. **Create Credentials** → OAuth 2.0 Client ID
5. **Application Type**: Web application
6. **Authorized redirect URIs**:
   ```
   https://your-app-name.vercel.app/api/auth/callback/google
   http://localhost:3000/api/auth/callback/google
   ```
7. **Copy**: Client ID and Client Secret
8. **Add to Vercel**: Environment Variables

## 🐙 GitHub OAuth Setup

1. **Go to**: [GitHub Developer Settings](https://github.com/settings/applications/new)
2. **Application name**: Digital Existence Platform
3. **Homepage URL**: `https://your-app-name.vercel.app`
4. **Authorization callback URL**: 
   ```
   https://your-app-name.vercel.app/api/auth/callback/github
   ```
5. **Register application**
6. **Copy**: Client ID and Client Secret

## 🎮 Discord OAuth Setup

1. **Go to**: [Discord Developer Portal](https://discord.com/developers/applications)
2. **New Application** → Name: Digital Existence Platform
3. **OAuth2** tab → **Add Redirect**:
   ```
   https://your-app-name.vercel.app/api/auth/callback/discord
   ```
4. **Copy**: Client ID and Client Secret

## 📝 Environment Variables

Add these to Vercel → Settings → Environment Variables:

```bash
# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# GitHub OAuth  
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret

# Discord OAuth
DISCORD_CLIENT_ID=your_discord_client_id
DISCORD_CLIENT_SECRET=your_discord_client_secret
```

## ✅ Testing Authentication

1. Visit your app: `https://your-app-name.vercel.app`
2. Click **Get Started** or **Login**
3. Try each OAuth provider
4. Should redirect to dashboard after login

---

**Next**: Test research functionality with your API keys!