import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { searchWeb, scrapeUrl } from '@/lib/firecrawl'
import { analyzeResearchData } from '@/lib/ai'
import { saveResearchReport, saveLargeResearchData } from '@/lib/blob'
import { z } from 'zod'

const ResearchRequestSchema = z.object({
  query: z.string().min(1).max(500),
  sources: z.array(z.string()).optional(),
  depth: z.enum(['quick', 'standard', 'comprehensive']).default('standard')
})

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
    const { query, sources, depth } = ResearchRequestSchema.parse(body)

    // Create research session
    const researchSession = await db.researchSession.create({
      data: {
        userId: session.user.id,
        query,
        status: 'PROCESSING',
        metadata: { depth, sources }
      }
    })

    // Perform research based on depth
    let webData: Array<{ url: string; title: string; content: string }> = []
    
    try {
      if (sources && sources.length > 0) {
        // Use provided sources
        for (const url of sources.slice(0, depth === 'comprehensive' ? 10 : depth === 'standard' ? 5 : 3)) {
          try {
            const result = await scrapeUrl(url)
            webData.push({
              url: result.url,
              title: result.metadata.title,
              content: result.markdown || ''
            })
          } catch (error) {
            console.error(`Failed to scrape ${url}:`, error)
          }
        }
      } else {
        // Search the web
        const searchLimit = depth === 'comprehensive' ? 15 : depth === 'standard' ? 10 : 5
        const searchResults = await searchWeb(query, { limit: searchLimit })
        
        // Scrape top results
        const scrapeLimit = depth === 'comprehensive' ? 8 : depth === 'standard' ? 5 : 3
        for (const result of searchResults.slice(0, scrapeLimit)) {
          try {
            const scrapedData = await scrapeUrl(result.url)
            webData.push({
              url: result.url,
              title: result.title,
              content: scrapedData.markdown || result.markdown || ''
            })
          } catch (error) {
            // Fallback to search result data
            webData.push({
              url: result.url,
              title: result.title,
              content: result.markdown || result.description
            })
          }
        }
      }

      // Analyze research data with AI
      const analysisResult = await analyzeResearchData(query, webData)

      // Save comprehensive research data to blob storage
      const fullResearchData = {
        query,
        analysis: analysisResult,
        sources: webData,
        metadata: {
          depth,
          sourcesCount: webData.length,
          completedAt: new Date().toISOString()
        }
      }

      const blobResult = await saveLargeResearchData(
        session.user.id,
        researchSession.id,
        fullResearchData
      )

      // Save summary report as markdown
      const markdownReport = `# Research Report: ${query}

## Summary
${analysisResult.summary}

## Key Points
${analysisResult.keyPoints.map(point => `- ${point}`).join('\n')}

## Sources
${analysisResult.sources.map(source => `- [${source.title}](${source.url}) (Relevance: ${source.relevance}/10)`).join('\n')}

## Insights
${analysisResult.insights.map(insight => `- ${insight}`).join('\n')}

## Recommendations
${analysisResult.recommendations.map(rec => `- ${rec}`).join('\n')}

---
Generated on ${new Date().toISOString()}
Confidence Level: ${analysisResult.confidence}/10`

      const reportBlob = await saveResearchReport(
        session.user.id,
        researchSession.id,
        markdownReport,
        'md'
      )

      // Update research session with results and blob URLs
      const updatedSession = await db.researchSession.update({
        where: { id: researchSession.id },
        data: {
          status: 'COMPLETED',
          results: {
            query,
            analysis: analysisResult,
            sources: webData.map(item => ({
              url: item.url,
              title: item.title,
              contentLength: item.content.length
            })),
            metadata: {
              depth,
              sourcesCount: webData.length,
              completedAt: new Date().toISOString(),
              blobUrls: {
                fullData: blobResult.url,
                report: reportBlob.url
              }
            }
          }
        }
      })

      // Create notification
      await db.notification.create({
        data: {
          userId: session.user.id,
          type: 'RESEARCH_COMPLETED',
          title: 'Research Complete',
          message: `Your research on "${query}" has been completed successfully.`,
          metadata: { researchSessionId: researchSession.id }
        }
      })

      return NextResponse.json({
        success: true,
        data: {
          sessionId: updatedSession.id,
          query,
          analysis: analysisResult,
          sources: webData.length,
          status: 'COMPLETED'
        }
      })

    } catch (error) {
      // Update session with error status
      await db.researchSession.update({
        where: { id: researchSession.id },
        data: {
          status: 'FAILED',
          metadata: { 
            error: error instanceof Error ? error.message : 'Unknown error',
            failedAt: new Date().toISOString()
          }
        }
      })

      throw error
    }

  } catch (error) {
    console.error('Research API error:', error)
    
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
    const offset = (page - 1) * limit

    // Get user's research sessions
    const [sessions, total] = await Promise.all([
      db.researchSession.findMany({
        where: { userId: session.user.id },
        orderBy: { createdAt: 'desc' },
        skip: offset,
        take: limit,
        select: {
          id: true,
          query: true,
          status: true,
          createdAt: true,
          updatedAt: true,
          metadata: true
        }
      }),
      db.researchSession.count({
        where: { userId: session.user.id }
      })
    ])

    return NextResponse.json({
      success: true,
      data: sessions,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    })

  } catch (error) {
    console.error('Research GET API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}