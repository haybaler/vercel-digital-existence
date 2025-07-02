"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { LoadingSpinner, LoadingCard } from '@/components/ui/loading'
import { TrendingUp, AlertTriangle, Eye, Settings, Plus, Activity, Bell, Clock } from 'lucide-react'

interface TrendMonitor {
  id: string
  name: string
  keywords: string[]
  status: 'ACTIVE' | 'PAUSED' | 'STOPPED'
  lastRun?: string
  createdAt: string
  alertCount: number
  recentAlerts: Array<{
    id: string
    title: string
    severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
    createdAt: string
    read: boolean
  }>
}

interface TrendAlert {
  id: string
  title: string
  description: string
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  createdAt: string
  read: boolean
  url?: string
}

export default function TrendsPage() {
  const [monitors, setMonitors] = useState<TrendMonitor[]>([])
  const [alerts, setAlerts] = useState<TrendAlert[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'overview' | 'monitors' | 'alerts'>('overview')

  useEffect(() => {
    fetchTrendData()
  }, [])

  const fetchTrendData = async () => {
    try {
      setLoading(true)
      // Fetch monitors and alerts
      const [monitorsRes, alertsRes] = await Promise.all([
        fetch('/api/trends'),
        fetch('/api/trends/alerts')
      ])

      if (monitorsRes.ok) {
        const monitorsData = await monitorsRes.json()
        setMonitors(monitorsData.data || [])
      }

      // For now, create some mock alerts since the alerts endpoint might not exist yet
      setAlerts([
        {
          id: '1',
          title: 'AI Trend Spike Detected',
          description: 'Significant increase in AI-related discussions across multiple sources',
          severity: 'HIGH',
          createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          read: false,
          url: 'https://example.com/ai-news'
        },
        {
          id: '2',
          title: 'Cryptocurrency Volatility Alert',
          description: 'Unusual activity detected in crypto-related content',
          severity: 'MEDIUM',
          createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
          read: true
        }
      ])
    } catch (error) {
      console.error('Failed to fetch trend data:', error)
    } finally {
      setLoading(false)
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'CRITICAL': return 'text-red-600 bg-red-100'
      case 'HIGH': return 'text-orange-600 bg-orange-100'
      case 'MEDIUM': return 'text-yellow-600 bg-yellow-100'
      case 'LOW': return 'text-green-600 bg-green-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'text-green-600 bg-green-100'
      case 'PAUSED': return 'text-yellow-600 bg-yellow-100'
      case 'STOPPED': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const unreadAlerts = alerts.filter(alert => !alert.read)

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <TrendingUp className="h-8 w-8 text-blue-600" />
            Trend Monitoring
          </h1>
          <p className="text-muted-foreground mt-2">
            Track emerging trends and get real-time alerts on topics that matter to you
          </p>
        </div>
        <Button size="lg" className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          New Monitor
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 mb-8">
        {[
          { id: 'overview', label: 'Overview', icon: Activity },
          { id: 'monitors', label: 'Monitors', icon: Eye },
          { id: 'alerts', label: 'Alerts', icon: Bell }
        ].map(tab => {
          const Icon = tab.icon
          return (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? 'default' : 'ghost'}
              className="flex items-center gap-2"
              onClick={() => setActiveTab(tab.id as any)}
            >
              <Icon className="h-4 w-4" />
              {tab.label}
              {tab.id === 'alerts' && unreadAlerts.length > 0 && (
                <span className="ml-1 px-2 py-1 bg-red-500 text-white text-xs rounded-full">
                  {unreadAlerts.length}
                </span>
              )}
            </Button>
          )
        })}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          {/* Stats Cards */}
          <div className="grid md:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Active Monitors</p>
                    <p className="text-2xl font-bold">{monitors.filter(m => m.status === 'ACTIVE').length}</p>
                  </div>
                  <Eye className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Alerts</p>
                    <p className="text-2xl font-bold">{alerts.length}</p>
                  </div>
                  <Bell className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Unread Alerts</p>
                    <p className="text-2xl font-bold text-red-600">{unreadAlerts.length}</p>
                  </div>
                  <AlertTriangle className="h-8 w-8 text-red-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Keywords Tracked</p>
                    <p className="text-2xl font-bold">{monitors.reduce((acc, m) => acc + m.keywords.length, 0)}</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest trend alerts and monitor updates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {alerts.slice(0, 5).map(alert => (
                  <div key={alert.id} className="flex items-start justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <AlertTriangle className="h-4 w-4 text-orange-500" />
                        <h4 className="font-medium">{alert.title}</h4>
                        <span className={`px-2 py-1 text-xs rounded-full ${getSeverityColor(alert.severity)}`}>
                          {alert.severity}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">{alert.description}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(alert.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <Button size="sm" variant="ghost">
                      View
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Monitors Tab */}
      {activeTab === 'monitors' && (
        <div className="space-y-6">
          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map(i => (
                <Card key={i}>
                  <CardContent className="p-6">
                    <LoadingCard />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : monitors.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {monitors.map(monitor => (
                <Card key={monitor.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{monitor.name}</CardTitle>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(monitor.status)}`}>
                            {monitor.status}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {monitor.alertCount} alerts
                          </span>
                        </div>
                      </div>
                      <Button size="sm" variant="ghost">
                        <Settings className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm font-medium mb-1">Keywords:</p>
                        <div className="flex flex-wrap gap-1">
                          {monitor.keywords.slice(0, 3).map((keyword, index) => (
                            <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                              {keyword}
                            </span>
                          ))}
                          {monitor.keywords.length > 3 && (
                            <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                              +{monitor.keywords.length - 3}
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          Created {new Date(monitor.createdAt).toLocaleDateString()}
                        </span>
                        {monitor.lastRun && (
                          <span>Last run: {new Date(monitor.lastRun).toLocaleDateString()}</span>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <TrendingUp className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium mb-2">No monitors yet</h3>
                <p className="text-muted-foreground mb-4">
                  Create your first trend monitor to start tracking topics and keywords.
                </p>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Monitor
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Alerts Tab */}
      {activeTab === 'alerts' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">All Alerts</h2>
            <Button variant="outline" size="sm">
              Mark All Read
            </Button>
          </div>

          <div className="space-y-4">
            {alerts.map(alert => (
              <Card key={alert.id} className={`${!alert.read ? 'border-blue-200 bg-blue-50/50' : ''}`}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <AlertTriangle className="h-5 w-5 text-orange-500" />
                        <h3 className="font-medium">{alert.title}</h3>
                        <span className={`px-2 py-1 text-xs rounded-full ${getSeverityColor(alert.severity)}`}>
                          {alert.severity}
                        </span>
                        {!alert.read && (
                          <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                        )}
                      </div>
                      <p className="text-muted-foreground mb-2">{alert.description}</p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>{new Date(alert.createdAt).toLocaleString()}</span>
                        {alert.url && (
                          <a href={alert.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                            View Source
                          </a>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="ghost">
                        View Details
                      </Button>
                      {!alert.read && (
                        <Button size="sm" variant="outline">
                          Mark Read
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}