"use client"

import { useEffect, useState, useCallback } from "react"
import { format } from "date-fns"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { isMockMode, getMockEntries } from "@/lib/mock-data"

interface Entry {
  id: string
  type: string
  status: string
  date?: string
  hoursWorked?: number
  expenseAmount?: number
  expenseCategory?: string
  startDate?: string
  endDate?: string
  vacationDays?: number
  travelDate?: string
  travelFrom?: string
  travelTo?: string
  travelKm?: number
  description?: string
  createdAt: string
}

export function EntryList() {
  const [entries, setEntries] = useState<Entry[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("all")
  const { toast } = useToast()

  const fetchEntries = useCallback(async (type?: string) => {
    setIsLoading(true)
    try {
      // Check if mock mode is enabled
      if (isMockMode()) {
        // Use mock data
        await new Promise(resolve => setTimeout(resolve, 300)) // Simulate loading
        let entryType = 'WORK_HOURS'
        if (type === "expenses") entryType = 'EXPENSE'
        else if (type === "vacation") entryType = 'VACATION'
        else if (type === "travel") entryType = 'TRAVEL'
        
        const mockEntries = getMockEntries({ type: entryType })
        // Filter to show only a subset for the current "user"
        setEntries(mockEntries.slice(0, 5))
        setIsLoading(false)
        return
      }

      const token = localStorage.getItem("token")
      if (!token) {
        throw new Error("Not authenticated")
      }

      let url = "/api/entries/hours"
      if (type === "expenses") url = "/api/entries/expenses"
      else if (type === "vacation") url = "/api/entries/vacation"
      else if (type === "travel") url = "/api/entries/travel"

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "Failed to fetch entries")
      }

      setEntries(result)
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to fetch entries",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }, [toast])

  useEffect(() => {
    if (activeTab === "all") {
      // For "all", we'd need to fetch from multiple endpoints
      // For now, just show hours
      fetchEntries("hours")
    } else {
      fetchEntries(activeTab)
    }
  }, [activeTab, fetchEntries])

  function getStatusBadge(status: string) {
    const variants: Record<string, "default" | "secondary" | "destructive"> = {
      PENDING: "secondary",
      APPROVED: "default",
      REJECTED: "destructive",
    }
    return <Badge variant={variants[status] || "default"}>{status}</Badge>
  }

  function getEntryDetails(entry: Entry) {
    switch (entry.type) {
      case "WORK_HOURS":
        return `${entry.hoursWorked} hours on ${entry.date ? format(new Date(entry.date), "PPP") : "N/A"}`
      case "EXPENSE":
        return `$${entry.expenseAmount} - ${entry.expenseCategory} on ${entry.date ? format(new Date(entry.date), "PPP") : "N/A"}`
      case "VACATION":
        return `${entry.vacationDays} days from ${entry.startDate ? format(new Date(entry.startDate), "PPP") : "N/A"} to ${entry.endDate ? format(new Date(entry.endDate), "PPP") : "N/A"}`
      case "TRAVEL":
        return `${entry.travelFrom} → ${entry.travelTo} (${entry.travelKm} km) on ${entry.travelDate ? format(new Date(entry.travelDate), "PPP") : "N/A"}`
      default:
        return "N/A"
    }
  }

  if (isLoading) {
    return <div className="text-center py-8">Loading entries...</div>
  }

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab}>
      <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 lg:w-auto lg:inline-flex">
        <TabsTrigger value="hours">Hours</TabsTrigger>
        <TabsTrigger value="expenses">Expenses</TabsTrigger>
        <TabsTrigger value="vacation">Vacation</TabsTrigger>
        <TabsTrigger value="travel">Travel</TabsTrigger>
      </TabsList>
      <TabsContent value={activeTab} className="mt-6">
        {entries.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No entries found
          </div>
        ) : (
          <div className="overflow-x-auto -mx-4 sm:mx-0">
            <div className="inline-block min-w-full align-middle">
              <div className="overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="whitespace-nowrap">Type</TableHead>
                      <TableHead className="min-w-[200px]">Details</TableHead>
                      <TableHead className="whitespace-nowrap">Status</TableHead>
                      <TableHead className="whitespace-nowrap hidden sm:table-cell">Submitted</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {entries.map((entry) => (
                      <TableRow key={entry.id}>
                        <TableCell className="font-medium whitespace-nowrap">
                          {entry.type.replace("_", " ")}
                        </TableCell>
                        <TableCell className="max-w-[250px] truncate">{getEntryDetails(entry)}</TableCell>
                        <TableCell>{getStatusBadge(entry.status)}</TableCell>
                        <TableCell className="whitespace-nowrap hidden sm:table-cell">
                          {format(new Date(entry.createdAt), "PPP")}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>
        )}
      </TabsContent>
    </Tabs>
  )
}

