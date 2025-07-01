import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

export async function GET(
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

    return NextResponse.json({
      success: true,
      data: researchSession
    })

  } catch (error) {
    console.error('Research detail API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
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

    await db.researchSession.delete({
      where: { id: params.id }
    })

    return NextResponse.json({
      success: true,
      message: 'Research session deleted successfully'
    })

  } catch (error) {
    console.error('Research delete API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}