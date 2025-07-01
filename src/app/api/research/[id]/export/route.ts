import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { exportResearchAsZip, generateDownloadUrl } from '@/lib/blob'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const researchSession = await db.researchSession.findFirst({
      where: {
        id: params.id,
        userId: session.user.id
      }
    })

    if (!researchSession) {
      return NextResponse.json(
        { error: 'Research session not found' },
        { status: 404 }
      )
    }

    if (researchSession.status !== 'COMPLETED') {
      return NextResponse.json(
        { error: 'Research session not completed yet' },
        { status: 400 }
      )
    }

    // Export research data as downloadable file
    const exportBlob = await exportResearchAsZip(
      session.user.id,
      researchSession.id,
      researchSession.results
    )

    const downloadUrl = generateDownloadUrl(
      exportBlob,
      `research-${researchSession.query.slice(0, 50)}.json`
    )

    return NextResponse.json({
      success: true,
      data: {
        downloadUrl,
        filename: `research-${researchSession.id}.json`,
        size: exportBlob.contentType,
        exportedAt: new Date().toISOString()
      }
    })

  } catch (error) {
    console.error('Export research API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}