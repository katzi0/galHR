import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { requireAdmin, getTokenFromHeader } from '@/lib/auth'
import { EntryStatus, EntryType } from '@prisma/client'

export async function GET(request: NextRequest) {
  try {
    // Verify admin access
    const token = getTokenFromHeader(request.headers.get('authorization'))
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    const payload = requireAdmin(token)
    if (!payload) {
      return NextResponse.json({ error: 'Forbidden - Admin access required' }, { status: 403 })
    }
    
    // Get query parameters
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status') as EntryStatus | null
    const type = searchParams.get('type') as EntryType | null
    const userId = searchParams.get('userId')
    
    // Build where clause
    const where: any = {}
    if (status) where.status = status
    if (type) where.type = type
    if (userId) where.userId = userId
    
    // Fetch entries with user info
    const entries = await prisma.entry.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            department: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })
    
    return NextResponse.json(entries)
  } catch (error) {
    console.error('Fetch entries error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

