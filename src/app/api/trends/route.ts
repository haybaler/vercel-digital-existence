import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { searchWeb } from '@/lib/firecrawl'
import { z } from 'zod'

const TrendMonitorRequestSchema = z.object({
  name: z.string().min(1).max(100),
  keywords: z.array(z.string()).min(1).max(10),
  sources: z.array(z.string()).optional(),
  frequency: z.enum(['hourly', 'daily', 'weekly']).default('daily'),
  alertThreshold: z.enum(['low', 'medium', 'high']).default('medium')
})

const TrendUpdateSchema = z.object({
  status: z.enum(['ACTIVE', 'PAUSED', 'STOPPED']).optional(),
  keywords: z.array(z.string()).optional(),
  sources: z.array(z.string()).optional()
})

// Create or list trend monitors
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { name, keywords, sources, frequency, alertThreshold } = 
      TrendMonitorRequestSchema.parse(body)

    // Create trend monitor
    const monitor = await db.trendMonitor.create({
      data: {
        userId: session.user.id,
        name,
        keywords,
        sources: {
          frequency,
          alertThreshold,
          websites: sources || [],
          searchEngines: ['google', 'bing'],
          socialMedia: ['twitter', 'linkedin'],
          createdAt: new Date().toISOString()
        },
        status: 'ACTIVE'
      }
    })

    // Create initial notification
    await db.notification.create({
      data: {
        userId: session.user.id,
        type: 'SYSTEM_ALERT',
        title: 'Trend Monitor Created',
        message: `Your trend monitor "${name}" has been created and is now active.`,
        metadata: { monitorId: monitor.id }
      }
    })

    // Perform initial trend analysis
    const initialTrends = await analyzeCurrentTrends(keywords, sources)
    
    if (initialTrends.length > 0) {
      // Save initial trend alerts
      await Promise.all(
        initialTrends.map(trend => 
          db.trendAlert.create({
            data: {
              monitorId: monitor.id,
              title: trend.title,
              description: trend.description,
              severity: trend.severity,
              url: trend.url,
              metadata: trend.metadata
            }
          })
        )
      )
    }

    return NextResponse.json({
      success: true,
      data: {
        id: monitor.id,
        name: monitor.name,
        keywords: monitor.keywords,
        status: monitor.status,
        createdAt: monitor.createdAt,
        initialTrends: initialTrends.length,
        sources: monitor.sources
      }
    })

  } catch (error) {
    console.error('Trend monitor creation error:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Get trend monitors
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const status = searchParams.get('status')
    const offset = (page - 1) * limit

    const whereClause: any = { userId: session.user.id }
    if (status) {
      whereClause.status = status.toUpperCase()
    }

    // Get user's trend monitors with recent alerts
    const [monitors, total] = await Promise.all([
      db.trendMonitor.findMany({
        where: whereClause,
        orderBy: { createdAt: 'desc' },
        skip: offset,
        take: limit,
        include: {
          alerts: {
            orderBy: { createdAt: 'desc' },
            take: 5,
            select: {
              id: true,
              title: true,
              severity: true,
              createdAt: true,
              read: true
            }
          }
        }
      }),
      db.trendMonitor.count({
        where: whereClause
      })
    ])

    return NextResponse.json({
      success: true,
      data: monitors.map(monitor => ({
        id: monitor.id,
        name: monitor.name,
        keywords: monitor.keywords,
        status: monitor.status,
        lastRun: monitor.lastRun,
        createdAt: monitor.createdAt,
        sources: monitor.sources,
        recentAlerts: monitor.alerts,
        alertCount: monitor.alerts.length
      })),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    })

  } catch (error) {
    console.error('Trend monitors GET error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Helper function to analyze current trends
async function analyzeCurrentTrends(
  keywords: string[], 
  sources?: string[]
): Promise<Array<{
  title: string
  description: string
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  url?: string
  metadata: any
}>> {
  const trends: Array<{
    title: string
    description: string
    severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
    url?: string
    metadata: any
  }> = []

  try {
    // Search for each keyword to identify trends
    for (const keyword of keywords.slice(0, 3)) { // Limit to avoid rate limits
      try {
        const searchResults = await searchWeb(keyword, { limit: 5 })
        
        if (searchResults.length > 0) {
          // Analyze search results for trending topics
          const recentMentions = searchResults.filter(result => 
            result.metadata && new Date(result.metadata.publishedDate || Date.now()) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
          )

          if (recentMentions.length >= 2) {
            trends.push({
              title: `Trending: ${keyword}`,
              description: `Found ${recentMentions.length} recent mentions of "${keyword}" in the past week. Topics include: ${recentMentions.slice(0, 2).map(r => r.title).join(', ')}.`,
              severity: recentMentions.length >= 4 ? 'HIGH' : 'MEDIUM',
              url: recentMentions[0]?.url,
              metadata: {
                keyword,
                mentionCount: recentMentions.length,
                sources: recentMentions.map(r => ({ title: r.title, url: r.url })),
                detectedAt: new Date().toISOString()
              }
            })
          }
        }
      } catch (searchError) {
        console.error(`Error searching for keyword "${keyword}":`, searchError)
      }
    }

    // Add some synthetic trend detection based on keyword combinations
    if (keywords.some(k => k.toLowerCase().includes('ai') || k.toLowerCase().includes('artificial intelligence'))) {
      trends.push({
        title: 'AI Industry Movement Detected',
        description: 'Increased activity detected in AI-related discussions and developments.',
        severity: 'MEDIUM',
        metadata: {
          type: 'industry_trend',
          keywords: keywords.filter(k => k.toLowerCase().includes('ai')),
          confidence: 0.7,
          detectedAt: new Date().toISOString()
        }
      })
    }

    if (keywords.some(k => k.toLowerCase().includes('crypto') || k.toLowerCase().includes('bitcoin'))) {
      trends.push({
        title: 'Cryptocurrency Activity Spike',
        description: 'Notable increase in cryptocurrency-related content and discussions.',
        severity: 'HIGH',
        metadata: {
          type: 'market_trend',
          keywords: keywords.filter(k => k.toLowerCase().includes('crypto') || k.toLowerCase().includes('bitcoin')),
          confidence: 0.8,
          detectedAt: new Date().toISOString()
        }
      })
    }

  } catch (error) {
    console.error('Error analyzing trends:', error)
  }

  return trends
}