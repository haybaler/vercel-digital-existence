import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { analyzeProject } from '@/lib/deScore'
import { z } from 'zod'

const BodySchema = z.object({
  domain: z.string().url()
})

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { domain } = BodySchema.parse(body)

    const result = await analyzeProject(domain, session.user.id)

    return NextResponse.json({ success: true, data: result })
  } catch (error) {
    console.error('DE score API error:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
