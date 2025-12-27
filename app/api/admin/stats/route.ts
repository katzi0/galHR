import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { requireAdmin, getTokenFromHeader } from '@/lib/auth'

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
    
    // Calculate date range for "this month"
    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59)
    
    // Get statistics
    const [
      totalUsers,
      adminCount,
      employeeCount,
      volunteerCount,
      pendingEntries,
      approvedThisMonth,
      hoursThisMonth,
      expensesThisMonth,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { role: 'ADMIN' } }),
      prisma.user.count({ where: { role: 'EMPLOYEE' } }),
      prisma.user.count({ where: { role: 'VOLUNTEER' } }),
      prisma.entry.count({ where: { status: 'PENDING' } }),
      prisma.entry.count({
        where: {
          status: 'APPROVED',
          createdAt: {
            gte: startOfMonth,
            lte: endOfMonth,
          },
        },
      }),
      prisma.entry.aggregate({
        where: {
          type: 'WORK_HOURS',
          status: 'APPROVED',
          date: {
            gte: startOfMonth,
            lte: endOfMonth,
          },
        },
        _sum: {
          hoursWorked: true,
        },
      }),
      prisma.entry.aggregate({
        where: {
          type: 'EXPENSE',
          status: 'APPROVED',
          date: {
            gte: startOfMonth,
            lte: endOfMonth,
          },
        },
        _sum: {
          expenseAmount: true,
        },
      }),
    ])
    
    return NextResponse.json({
      users: {
        total: totalUsers,
        admin: adminCount,
        employee: employeeCount,
        volunteer: volunteerCount,
      },
      entries: {
        pending: pendingEntries,
        approvedThisMonth,
      },
      thisMonth: {
        totalHours: hoursThisMonth._sum.hoursWorked || 0,
        totalExpenses: expensesThisMonth._sum.expenseAmount || 0,
      },
    })
  } catch (error) {
    console.error('Fetch stats error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

