import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { generateContent } from '@/lib/ai'
import { z } from 'zod'

const ContentGenerationRequestSchema = z.object({
  type: z.enum(['blog', 'social', 'newsletter', 'seo']),
  topic: z.string().min(1).max(200),
  targetKeywords: z.array(z.string()).optional(),
  tone: z.enum(['professional', 'casual', 'technical', 'creative']).default('professional'),
  length: z.enum(['short', 'medium', 'long']).default('medium'),
  researchSessionId: z.string().optional(),
  platform: z.enum(['twitter', 'linkedin', 'facebook', 'instagram']).optional()
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
    const { type, topic, targetKeywords, tone, length, researchSessionId, platform } = 
      ContentGenerationRequestSchema.parse(body)

    // Get research data if provided
    let researchData = null
    if (researchSessionId) {
      const researchSession = await db.researchSession.findFirst({
        where: {
          id: researchSessionId,
          userId: session.user.id
        }
      })
      
      if (researchSession?.results && typeof researchSession.results === 'object') {
        const results = researchSession.results as any
        if (results.sources && Array.isArray(results.sources)) {
          researchData = results.sources
        }
      }
    }

    // Generate content using AI
    const generatedContent = await generateContent(topic, type, researchData)

    // Save generated content to database
    const savedContent = await db.generatedContent.create({
      data: {
        userId: session.user.id,
        type: type.toUpperCase() as any,
        title: generatedContent.title,
        content: generatedContent.content,
        metadata: {
          topic,
          tone,
          length,
          targetKeywords,
          platform,
          researchSessionId,
          generatedAt: new Date().toISOString(),
          wordCount: generatedContent.content.split(' ').length,
          estimatedReadingTime: generatedContent.readingTime,
          seoScore: generatedContent.seoScore,
          excerpt: generatedContent.excerpt,
          tags: generatedContent.tags
        }
      }
    })

    // Create notification
    await db.notification.create({
      data: {
        userId: session.user.id,
        type: 'CONTENT_GENERATED',
        title: 'Content Generated',
        message: `Your ${type} content "${generatedContent.title}" has been generated successfully.`,
        metadata: { contentId: savedContent.id, contentType: type }
      }
    })

    return NextResponse.json({
      success: true,
      data: {
        id: savedContent.id,
        title: generatedContent.title,
        content: generatedContent.content,
        excerpt: generatedContent.excerpt,
        tags: generatedContent.tags,
        type,
        seoScore: generatedContent.seoScore,
        readingTime: generatedContent.readingTime,
        metadata: savedContent.metadata,
        createdAt: savedContent.createdAt
      }
    })

  } catch (error) {
    console.error('Content generation API error:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Internal server error', message: error instanceof Error ? error.message : 'Unknown error' },
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
    const type = searchParams.get('type')
    const offset = (page - 1) * limit

    const whereClause: any = { userId: session.user.id }
    if (type) {
      whereClause.type = type.toUpperCase()
    }

    // Get user's generated content
    const [content, total] = await Promise.all([
      db.generatedContent.findMany({
        where: whereClause,
        orderBy: { createdAt: 'desc' },
        skip: offset,
        take: limit,
        select: {
          id: true,
          type: true,
          title: true,
          content: true,
          createdAt: true,
          updatedAt: true,
          metadata: true
        }
      }),
      db.generatedContent.count({
        where: whereClause
      })
    ])

    return NextResponse.json({
      success: true,
      data: content,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    })

  } catch (error) {
    console.error('Content GET API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}