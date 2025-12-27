import { NextRequest, NextResponse } from "next/server"
import { verifyToken } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { isMockMode, getMockEntries } from "@/lib/mock-data"

export async function GET(request: NextRequest) {
  try {
    // Check if mock mode is enabled
    if (isMockMode()) {
      const url = new URL(request.url)
      const startDate = url.searchParams.get("startDate")
      const endDate = url.searchParams.get("endDate")
      
      // Get mock entries for all types
      const allMockEntries = [
        ...getMockEntries({ type: 'WORK_HOURS' }),
        ...getMockEntries({ type: 'EXPENSE' }),
        ...getMockEntries({ type: 'VACATION' }),
        ...getMockEntries({ type: 'TRAVEL' }),
      ]
      
      // Filter by date range if provided
      let filteredEntries = allMockEntries
      if (startDate && endDate) {
        const start = new Date(startDate)
        const end = new Date(endDate)
        
        filteredEntries = allMockEntries.filter(entry => {
          // Get the primary date for the entry
          let entryDate: Date | null = null
          if (entry.date) entryDate = new Date(entry.date)
          else if (entry.travelDate) entryDate = new Date(entry.travelDate)
          else if (entry.startDate) entryDate = new Date(entry.startDate)
          
          if (!entryDate) return false
          return entryDate >= start && entryDate <= end
        })
      }
      
      return NextResponse.json(filteredEntries.slice(0, 20))
    }

    const authHeader = request.headers.get("authorization")
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const token = authHeader.substring(7)
    const payload = await verifyToken(token)

    if (!payload) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    const url = new URL(request.url)
    const startDate = url.searchParams.get("startDate")
    const endDate = url.searchParams.get("endDate")

    // Build the where clause
    const whereClause: any = {
      userId: payload.userId,
    }

    // Add date filtering if provided
    if (startDate && endDate) {
      // We need to check multiple date fields depending on entry type
      whereClause.OR = [
        // For WORK_HOURS entries
        {
          type: "WORK_HOURS",
          date: {
            gte: new Date(startDate),
            lte: new Date(endDate),
          },
        },
        // For EXPENSE entries
        {
          type: "EXPENSE",
          date: {
            gte: new Date(startDate),
            lte: new Date(endDate),
          },
        },
        // For VACATION entries (check if range overlaps)
        {
          type: "VACATION",
          AND: [
            {
              startDate: {
                lte: new Date(endDate),
              },
            },
            {
              endDate: {
                gte: new Date(startDate),
              },
            },
          ],
        },
        // For TRAVEL entries
        {
          type: "TRAVEL",
          travelDate: {
            gte: new Date(startDate),
            lte: new Date(endDate),
          },
        },
      ]
    }

    const entries = await prisma.entry.findMany({
      where: whereClause,
      orderBy: [
        { date: "desc" },
        { travelDate: "desc" },
        { startDate: "desc" },
        { createdAt: "desc" },
      ],
      take: 100, // Limit to prevent excessive data
    })

    return NextResponse.json(entries)
  } catch (error: any) {
    console.error("Error fetching entries:", error)
    return NextResponse.json(
      { error: error.message || "Failed to fetch entries" },
      { status: 500 }
    )
  }
}

