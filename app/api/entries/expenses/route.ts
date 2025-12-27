import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { verifyToken, getTokenFromHeader } from '@/lib/auth'
import { expenseEntrySchema } from '@/lib/validations'

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
    const validatedData = expenseEntrySchema.parse(body)
    
    // Create entry
    const entry = await prisma.entry.create({
      data: {
        userId: payload.userId,
        type: 'EXPENSE',
        status: 'PENDING',
        date: new Date(validatedData.date),
        expenseAmount: validatedData.expenseAmount,
        expenseCategory: validatedData.expenseCategory,
        description: validatedData.description,
        receiptUrl: validatedData.receiptUrl,
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
    
    console.error('Create expense entry error:', error)
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
    
    // Fetch user's expense entries
    const entries = await prisma.entry.findMany({
      where: {
        userId: payload.userId,
        type: 'EXPENSE',
      },
      orderBy: {
        date: 'desc',
      },
    })
    
    return NextResponse.json(entries)
  } catch (error) {
    console.error('Fetch expense entries error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

