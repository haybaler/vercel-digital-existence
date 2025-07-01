# 🤖 Vercel Digital Existence Platform

> AI-powered research, content generation, and trend monitoring platform built with Next.js, Firecrawl, and multiple AI providers.

[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![Vercel](https://img.shields.io/badge/Vercel-Deployed-black)](https://vercel.com/)
[![Firecrawl](https://img.shields.io/badge/Firecrawl-Integrated-orange)](https://firecrawl.dev/)

## 🎯 What This Platform Does

Transform your digital research and content creation workflow with AI-powered automation:

- **🔍 Deep Web Research**: Multi-step AI reasoning for comprehensive analysis
- **📝 Content Generation**: Automated blog posts, SEO content, and social media
- **📈 Trend Monitoring**: Real-time tracking of emerging trends and topics
- **🤖 Multi-AI Integration**: Leverage OpenAI, Anthropic, Google, and more
- **🔄 Workflow Automation**: Schedule and automate research tasks

## 🏗️ Tech Stack

### Core Technologies
- **Frontend**: Next.js 14 (App Router), React, TypeScript
- **Styling**: Tailwind CSS
- **Database**: Vercel Postgres
- **Authentication**: NextAuth.js
- **Deployment**: Vercel

### AI & Data
- **Web Scraping**: Firecrawl API + MCP
- **AI Models**: OpenAI, Anthropic, Google, Cohere, Groq
- **AI SDK**: Vercel AI SDK for unified model access
- **Data Processing**: Structured outputs and reasoning chains

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Vercel account
- API keys for your chosen AI providers

### 1. Clone & Install

```bash
git clone https://github.com/your-username/vercel-digital-existence.git
cd vercel-digital-existence
npm install
```

### 2. Environment Setup

Copy `.env.example` to `.env.local` and fill in your API keys:

```env
# Firecrawl API
FIRECRAWL_API_KEY=your_firecrawl_key

# AI Model APIs (choose your providers)
OPENAI_API_KEY=your_openai_key
ANTHROPIC_API_KEY=your_anthropic_key
GOOGLE_API_KEY=your_google_key

# Vercel Postgres (auto-populated in production)
POSTGRES_URL=your_postgres_url

# NextAuth.js
NEXTAUTH_SECRET=your_secret_key
NEXTAUTH_URL=http://localhost:3000

# OAuth Providers
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

### 3. Database Setup

```bash
# Create Vercel Postgres database
vercel env pull .env.local
npx prisma generate
npx prisma db push
```

### 4. Configure Firecrawl MCP

Add to your Claude Desktop config (`~/Library/Application Support/Claude/claude_desktop_config.json`):

```json
{
  "mcpServers": {
    "firecrawl-mcp": {
      "command": "npx",
      "args": ["-y", "firecrawl-mcp"],
      "env": {
        "FIRECRAWL_API_KEY": "your_firecrawl_key"
      }
    }
  }
}
```

### 5. Run Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see your application.

## 📱 Features & Usage

### 🔍 AI Research Engine

**Deep Web Research**
- Enter any research query
- AI performs multi-step reasoning
- Cross-references multiple sources
- Generates comprehensive reports

```typescript
// Example API usage
const research = await fetch('/api/research', {
  method: 'POST',
  body: JSON.stringify({
    query: "AI trends in enterprise software 2024",
    depth: "comprehensive",
    sources: ["web", "social", "news"]
  })
});
```

### 📝 Content Generation

**AI-Powered Content Creation**
- Blog posts from research
- SEO-optimized articles
- Social media content
- Newsletter generation

### 📈 Trend Monitoring

**Real-Time Trend Detection**
- Monitor websites and social media
- AI-powered trend analysis
- Custom alert notifications
- Scheduled monitoring workflows

## 🏗️ Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Authentication routes
│   │   ├── login/         # Login page
│   │   └── register/      # Registration page
│   ├── dashboard/         # Main dashboard
│   ├── research/          # Research interface
│   │   ├── new/           # New research form
│   │   └── [id]/          # Research results
│   ├── content/           # Content generation
│   │   ├── blog/          # Blog generation
│   │   └── social/        # Social media content
│   ├── trends/            # Trend monitoring
│   │   ├── monitors/      # Active monitors
│   │   └── alerts/        # Alert history
│   └── api/               # API routes
│       ├── auth/          # NextAuth.js
│       ├── research/      # Research endpoints
│       ├── content/       # Content generation
│       └── trends/        # Trend monitoring
├── components/            # Reusable UI components
│   ├── ui/                # Base UI components
│   ├── research/          # Research-specific components
│   ├── content/           # Content components
│   └── trends/            # Trend components
├── lib/                   # Utilities and configurations
│   ├── ai/                # AI provider configurations
│   ├── db/                # Database utilities
│   ├── firecrawl/         # Firecrawl integration
│   └── auth/              # Authentication config
├── hooks/                 # Custom React hooks
├── types/                 # TypeScript definitions
└── styles/                # Global styles
```

## 🔧 Configuration

### AI Provider Setup

Configure your preferred AI models in `lib/ai/config.ts`:

```typescript
export const AI_CONFIG = {
  providers: {
    openai: {
      models: ['gpt-4', 'gpt-3.5-turbo'],
      useCases: ['research', 'content', 'analysis']
    },
    anthropic: {
      models: ['claude-3-opus', 'claude-3-sonnet'],
      useCases: ['research', 'reasoning', 'content']
    },
    google: {
      models: ['gemini-pro', 'gemini-pro-vision'],
      useCases: ['structured-data', 'analysis']
    }
  }
};
```

### Database Schema

```sql
-- NextAuth.js tables (auto-generated)
users, accounts, sessions, verification_tokens

-- Research system
research_sessions (
  id SERIAL PRIMARY KEY,
  user_id TEXT REFERENCES users(id),
  query TEXT NOT NULL,
  results JSONB,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Content generation
generated_content (
  id SERIAL PRIMARY KEY,
  user_id TEXT REFERENCES users(id),
  type TEXT NOT NULL,
  title TEXT,
  content TEXT,
  metadata JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Trend monitoring
trend_monitors (
  id SERIAL PRIMARY KEY,
  user_id TEXT REFERENCES users(id),
  name TEXT NOT NULL,
  sources JSONB,
  keywords TEXT[],
  status TEXT DEFAULT 'active',
  last_run TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);
```

## 🚀 Deployment

### Vercel Deployment

1. **Connect Repository**
   ```bash
   vercel --prod
   ```

2. **Configure Environment Variables**
   - Add all environment variables in Vercel dashboard
   - Vercel Postgres will auto-populate database URLs

3. **Set up Domains**
   - Configure custom domain in Vercel
   - Update `NEXTAUTH_URL` in environment variables

### Database Migration

```bash
# Production database setup
npx prisma generate
npx prisma db push --accept-data-loss
```

## 📊 Monitoring & Analytics

### Built-in Analytics
- Research query patterns
- Content generation metrics
- Trend detection accuracy
- User engagement tracking

### Performance Monitoring
- API response times
- AI model usage costs
- Database query performance
- Error tracking and alerts

## 🔐 Security & Privacy

### Data Protection
- User data encryption at rest
- Secure API key management
- GDPR compliance features
- Regular security audits

### Authentication
- OAuth integration (Google, GitHub, Discord)
- Session management with NextAuth.js
- Role-based access control
- API rate limiting

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Use TypeScript for all new code
- Follow the existing code style
- Add tests for new features
- Update documentation as needed

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Firecrawl](https://firecrawl.dev/) for web scraping capabilities
- [Vercel](https://vercel.com/) for deployment and database
- [OpenAI](https://openai.com/), [Anthropic](https://anthropic.com/), and other AI providers
- Open source community for inspiration and tools

## 📞 Support

- 📧 Email: support@your-domain.com
- 💬 Discord: [Join our community](https://discord.gg/your-invite)
- 📖 Documentation: [docs.your-domain.com](https://docs.your-domain.com)
- 🐛 Issues: [GitHub Issues](https://github.com/your-username/vercel-digital-existence/issues)

---

<div align="center">
  <strong>Built with ❤️ using AI and modern web technologies</strong>
</div>