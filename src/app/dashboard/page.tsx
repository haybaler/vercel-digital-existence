"use client"

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { LoadingCard } from '@/components/ui/loading'
import { Search, BookOpen, TrendingUp, BarChart3, Settings, User, Plus, Bell, Clock, Target, Activity, FileText } from 'lucide-react'
import Link from 'next/link'

interface DashboardStats {
  researchSessions: number
  contentGenerated: number
  activeMonitors: number
  unreadAlerts: number
  apiUsage: number
}

interface RecentActivity {
  id: string
  type: 'research' | 'content' | 'trend' | 'alert'
  title: string
  description: string
  createdAt: string
  status?: string
}

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const [stats, setStats] = useState<DashboardStats>({
    researchSessions: 0,
    contentGenerated: 0,
    activeMonitors: 0,
    unreadAlerts: 0,
    apiUsage: 0
  })
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'authenticated') {
      fetchDashboardData()
    }
  }, [status])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      
      // Fetch dashboard stats from multiple endpoints
      const [researchRes, contentRes, trendsRes] = await Promise.all([
        fetch('/api/research'),
        fetch('/api/content'),
        fetch('/api/trends')
      ])

      let researchCount = 0, contentCount = 0, monitorsCount = 0

      if (researchRes.ok) {
        const researchData = await researchRes.json()
        researchCount = researchData.pagination?.total || 0
      }

      if (contentRes.ok) {
        const contentData = await contentRes.json()
        contentCount = contentData.pagination?.total || 0
      }

      if (trendsRes.ok) {
        const trendsData = await trendsRes.json()
        monitorsCount = trendsData.data?.filter((m: any) => m.status === 'ACTIVE').length || 0
      }

      setStats({
        researchSessions: researchCount,
        contentGenerated: contentCount,
        activeMonitors: monitorsCount,
        unreadAlerts: 2, // Mock data
        apiUsage: researchCount + contentCount
      })

      // Mock recent activity data
      setRecentActivity([
        {
          id: '1',
          type: 'research',
          title: 'AI Market Research Completed',
          description: 'Comprehensive analysis of AI market trends',
          createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          status: 'completed'
        },
        {
          id: '2',
          type: 'content',
          title: 'Blog Post Generated',
          description: 'Digital Marketing Trends 2024 - Complete Guide',
          createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
          status: 'generated'
        },
        {
          id: '3',
          type: 'alert',
          title: 'Trend Alert: AI Surge',
          description: 'Significant increase in AI-related discussions',
          createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
          status: 'unread'
        }
      ])

    } catch (error) {
      console.error('Failed to fetch dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (status === 'unauthenticated') {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Authentication Required</h2>
          <p className="mb-4">Please sign in to access your dashboard.</p>
          <Link href="/api/auth/signin">
            <Button>Sign In</Button>
          </Link>
        </div>
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
              <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                Dashboard
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Button variant="outline" size="sm">
                  <Bell className="h-4 w-4" />
                  {stats.unreadAlerts > 0 && (
                    <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
                      {stats.unreadAlerts}
                    </span>
                  )}
                </Button>
              </div>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Welcome back, {session?.user?.name || session?.user?.email}
              </span>
              <Button variant="outline" size="sm">
                <User className="h-4 w-4 mr-2" />
                Profile
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Welcome Section */}
        <div className="px-4 py-6 sm:px-0 mb-8">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-8 text-white">
            <h2 className="text-2xl font-bold mb-4">
              Welcome to Digital Existence Platform
            </h2>
            <p className="mb-6 opacity-90">
              Your AI-powered research and content generation hub. Get started with intelligent research, create engaging content, and monitor trends.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/research/new">
                <Button variant="secondary">
                  <Search className="h-4 w-4 mr-2" />
                  Start Research
                </Button>
              </Link>
              <Link href="/content/blog">
                <Button variant="outline" className="text-white border-white hover:bg-white hover:text-blue-600">
                  <BookOpen className="h-4 w-4 mr-2" />
                  Generate Content
                </Button>
              </Link>
              <Link href="/trends">
                <Button variant="outline" className="text-white border-white hover:bg-white hover:text-purple-600">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Monitor Trends
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Research Sessions</CardTitle>
              <Search className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
              ) : (
                <>
                  <div className="text-2xl font-bold">{stats.researchSessions}</div>
                  <p className="text-xs text-muted-foreground">
                    {stats.researchSessions > 0 ? 'Total completed' : 'Get started with research'}
                  </p>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Content Generated</CardTitle>
              <BookOpen className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
              ) : (
                <>
                  <div className="text-2xl font-bold">{stats.contentGenerated}</div>
                  <p className="text-xs text-muted-foreground">
                    {stats.contentGenerated > 0 ? 'Articles created' : 'Create your first content'}
                  </p>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Monitors</CardTitle>
              <TrendingUp className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
              ) : (
                <>
                  <div className="text-2xl font-bold">{stats.activeMonitors}</div>
                  <p className="text-xs text-muted-foreground">
                    {stats.activeMonitors > 0 ? 'Tracking trends' : 'Setup trend monitoring'}
                  </p>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Alerts</CardTitle>
              <Bell className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
              ) : (
                <>
                  <div className="text-2xl font-bold text-red-600">{stats.unreadAlerts}</div>
                  <p className="text-xs text-muted-foreground">
                    {stats.unreadAlerts > 0 ? 'Unread alerts' : 'No new alerts'}
                  </p>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">API Usage</CardTitle>
              <BarChart3 className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
              ) : (
                <>
                  <div className="text-2xl font-bold">{stats.apiUsage}</div>
                  <p className="text-xs text-muted-foreground">
                    Total operations
                  </p>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Quick Actions
              </CardTitle>
              <CardDescription>Jump into your most common tasks</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Link href="/research/new" className="block">
                <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <Search className="h-8 w-8 text-blue-600" />
                    <div>
                      <h3 className="font-medium">New Research</h3>
                      <p className="text-sm text-muted-foreground">Start AI-powered research</p>
                    </div>
                  </div>
                  <Button size="sm">Start</Button>
                </div>
              </Link>

              <Link href="/content/blog" className="block">
                <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <BookOpen className="h-8 w-8 text-green-600" />
                    <div>
                      <h3 className="font-medium">Generate Blog Post</h3>
                      <p className="text-sm text-muted-foreground">Create engaging content</p>
                    </div>
                  </div>
                  <Button size="sm" variant="outline">Create</Button>
                </div>
              </Link>

              <Link href="/trends" className="block">
                <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <TrendingUp className="h-8 w-8 text-purple-600" />
                    <div>
                      <h3 className="font-medium">Setup Monitor</h3>
                      <p className="text-sm text-muted-foreground">Track trending topics</p>
                    </div>
                  </div>
                  <Button size="sm" variant="outline">Setup</Button>
                </div>
              </Link>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Recent Activity
              </CardTitle>
              <CardDescription>Your latest actions and updates</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map(i => (
                    <LoadingCard key={i} />
                  ))}
                </div>
              ) : recentActivity.length > 0 ? (
                <div className="space-y-4">
                  {recentActivity.map(activity => (
                    <div key={activity.id} className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-1">
                        {activity.type === 'research' && <Search className="h-4 w-4 text-blue-600" />}
                        {activity.type === 'content' && <FileText className="h-4 w-4 text-green-600" />}
                        {activity.type === 'trend' && <TrendingUp className="h-4 w-4 text-purple-600" />}
                        {activity.type === 'alert' && <Bell className="h-4 w-4 text-red-600" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm">{activity.title}</p>
                        <p className="text-sm text-muted-foreground">{activity.description}</p>
                        <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {new Date(activity.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Activity className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <p className="text-muted-foreground">No recent activity</p>
                  <p className="text-sm text-muted-foreground">Start using the platform to see your activity here</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}