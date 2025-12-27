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
      <TabsList>
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
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead>Details</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Submitted</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {entries.map((entry) => (
                <TableRow key={entry.id}>
                  <TableCell className="font-medium">
                    {entry.type.replace("_", " ")}
                  </TableCell>
                  <TableCell>{getEntryDetails(entry)}</TableCell>
                  <TableCell>{getStatusBadge(entry.status)}</TableCell>
                  <TableCell>
                    {format(new Date(entry.createdAt), "PPP")}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </TabsContent>
    </Tabs>
  )
}

