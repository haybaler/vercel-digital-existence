'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Search, Loader2, Brain, Globe, FileText, TrendingUp } from 'lucide-react'
import Link from 'next/link'

interface ResearchSession {
  id: string
  query: string
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED'
  createdAt: string
  updatedAt: string
  metadata?: any
}

export default function ResearchPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [recentSessions, setRecentSessions] = useState<ResearchSession[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login')
    }
  }, [status, router])

  useEffect(() => {
    if (session?.user) {
      fetchRecentSessions()
    }
  }, [session])

  const fetchRecentSessions = async () => {
    try {
      const response = await fetch('/api/research?limit=5')
      const data = await response.json()
      
      if (data.success) {
        setRecentSessions(data.data)
      }
    } catch (error) {
      console.error('Failed to fetch research sessions:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (status === 'loading' || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/dashboard" className="text-blue-600 hover:text-blue-700 mr-4">
                ← Dashboard
              </Link>
              <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                AI Research Engine
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {session?.user?.name || session?.user?.email}
              </span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="px-4 py-6 sm:px-0">
          <div className="text-center mb-8">
            <Brain className="h-16 w-16 text-blue-600 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              AI-Powered Research Engine
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Conduct comprehensive research with AI reasoning, web scraping, and intelligent analysis.
              Get structured insights from multiple sources.
            </p>
          </div>

          {/* New Research CTA */}
          <div className="flex justify-center mb-12">
            <Link href="/research/new">
              <Button size="lg" className="px-8 py-4 text-lg">
                <Search className="h-5 w-5 mr-2" />
                Start New Research
              </Button>
            </Link>
          </div>
        </div>

        {/* Research Types */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card>
            <CardHeader>
              <div className="flex items-center">
                <Globe className="h-6 w-6 text-blue-600 mr-2" />
                <CardTitle>Web Research</CardTitle>
              </div>
              <CardDescription>
                Search and analyze web content with AI-powered insights
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Multi-source web scraping</li>
                <li>• Intelligent content extraction</li>
                <li>• Source credibility analysis</li>
                <li>• Automated fact-checking</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center">
                <FileText className="h-6 w-6 text-green-600 mr-2" />
                <CardTitle>Company Intelligence</CardTitle>
              </div>
              <CardDescription>
                Deep dive into company information and market analysis
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Financial performance analysis</li>
                <li>• Competitor landscape</li>
                <li>• Industry trends</li>
                <li>• Leadership insights</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center">
                <TrendingUp className="h-6 w-6 text-purple-600 mr-2" />
                <CardTitle>Market Research</CardTitle>
              </div>
              <CardDescription>
                Comprehensive market analysis and trend identification
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Market size and growth</li>
                <li>• Customer behavior patterns</li>
                <li>• Emerging opportunities</li>
                <li>• Risk assessment</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Recent Research Sessions */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Recent Research Sessions
            </h3>
          </div>
          <div className="p-6">
            {recentSessions.length === 0 ? (
              <div className="text-center py-8">
                <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400">
                  No research sessions yet. Start your first research project!
                </p>
                <Link href="/research/new">
                  <Button className="mt-4">
                    Start Research
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {recentSessions.map((session) => (
                  <div
                    key={session.id}
                    className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        {session.query}
                      </h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {new Date(session.createdAt).toLocaleDateString()} • Status: {session.status}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        session.status === 'COMPLETED' 
                          ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100'
                          : session.status === 'PROCESSING'
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100'
                          : session.status === 'FAILED'
                          ? 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100'
                          : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100'
                      }`}>
                        {session.status}
                      </span>
                      <Link href={`/research/${session.id}`}>
                        <Button variant="outline" size="sm">
                          View
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
                <div className="text-center pt-4">
                  <Link href="/research/history">
                    <Button variant="outline">
                      View All Research
                    </Button>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}