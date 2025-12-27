import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { verifyToken, getTokenFromHeader } from '@/lib/auth'
import { hoursEntrySchema } from '@/lib/validations'

export async function POST(request: NextRequest) {
  try {
    // Verify token
    const token = getTokenFromHeader(request.headers.get('authorization'))
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    const payload = verifyToken(token)
    if (!payload) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }
    
    const body = await request.json()
    
    // Validate input
    const validatedData = hoursEntrySchema.parse(body)
    
    // Create entry
    const entry = await prisma.entry.create({
      data: {
        userId: payload.userId,
        type: 'WORK_HOURS',
        status: 'PENDING',
        date: new Date(validatedData.date),
        hoursWorked: validatedData.hoursWorked,
        description: validatedData.description,
      },
    })
    
    return NextResponse.json(entry, { status: 201 })
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      )
    }
    
    console.error('Create hours entry error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    // Verify token
    const token = getTokenFromHeader(request.headers.get('authorization'))
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    const payload = verifyToken(token)
    if (!payload) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }
    
    // Fetch user's work hours entries
    const entries = await prisma.entry.findMany({
      where: {
        userId: payload.userId,
        type: 'WORK_HOURS',
      },
      orderBy: {
        date: 'desc',
      },
    })
    
    return NextResponse.json(entries)
  } catch (error) {
    console.error('Fetch hours entries error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

