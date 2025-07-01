import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Search, BookOpen, TrendingUp, Zap } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Zap className="h-8 w-8 text-blue-600" />
            <h1 className="text-2xl font-bold">Digital Existence</h1>
          </div>
          <nav className="flex items-center space-x-4">
            <Link href="/dashboard">
              <Button variant="outline">Dashboard</Button>
            </Link>
            <Link href="/auth/login">
              <Button>Get Started</Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="flex-1 flex items-center justify-center bg-gradient-to-b from-blue-50 to-white dark:from-blue-950 dark:to-background">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-6xl font-bold mb-6">
            AI-Powered Digital
            <span className="text-blue-600"> Research Platform</span>
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Transform your research workflow with intelligent web scraping, content generation, and trend monitoring powered by multiple AI models.
          </p>
          <div className="flex justify-center space-x-4">
            <Link href="/auth/register">
              <Button size="lg" className="px-8">
                Start Free Trial
              </Button>
            </Link>
            <Link href="/demo">
              <Button size="lg" variant="outline" className="px-8">
                View Demo
              </Button>
            </Link>
            <Link href="/de-score">
              <Button size="lg" variant="secondary" className="px-8">
                Try Now
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white dark:bg-background">
        <div className="container mx-auto px-4">
          <h3 className="text-3xl font-bold text-center mb-12">
            Everything you need for intelligent research
          </h3>
          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <Search className="h-10 w-10 text-blue-600 mb-2" />
                <CardTitle>AI Research Engine</CardTitle>
                <CardDescription>
                  Deep web research with multi-step reasoning and source verification
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Multi-provider AI integration</li>
                  <li>• Intelligent source cross-referencing</li>
                  <li>• Structured data extraction</li>
                  <li>• Company intelligence reports</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <BookOpen className="h-10 w-10 text-green-600 mb-2" />
                <CardTitle>Content Generation</CardTitle>
                <CardDescription>
                  Transform research into high-quality content automatically
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• AI-powered blog creation</li>
                  <li>• SEO optimization tools</li>
                  <li>• Social media content</li>
                  <li>• Newsletter automation</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <TrendingUp className="h-10 w-10 text-purple-600 mb-2" />
                <CardTitle>Trend Monitoring</CardTitle>
                <CardDescription>
                  Real-time trend detection and analysis with smart alerts
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Social media monitoring</li>
                  <li>• Website trend tracking</li>
                  <li>• AI-powered analysis</li>
                  <li>• Slack/Discord alerts</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Zap className="h-6 w-6 text-blue-600" />
              <span className="font-semibold">Digital Existence Platform</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Built with Next.js, Firecrawl, and AI
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}