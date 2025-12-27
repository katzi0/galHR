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
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Check, X } from "lucide-react"
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
  user: {
    id: string
    name: string
    email: string
    role: string
    department?: string
  }
}

export function EntryTable() {
  const [entries, setEntries] = useState<Entry[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("all")
  const { toast } = useToast()

  const fetchEntries = useCallback(async (status?: string) => {
    setIsLoading(true)
    try {
      const token = localStorage.getItem("token")
      if (!token) {
        throw new Error("Not authenticated")
      }

      let url = "/api/admin/entries"
      if (status && status !== "all") {
        url += `?status=${status.toUpperCase()}`
      }

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

  async function updateEntryStatus(entryId: string, status: "APPROVED" | "REJECTED") {
    try {
      const token = localStorage.getItem("token")
      if (!token) {
        throw new Error("Not authenticated")
      }

      const response = await fetch(`/api/admin/entries/${entryId}/approve`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "Failed to update entry")
      }

      toast({
        title: "Success",
        description: `Entry ${status.toLowerCase()} successfully`,
      })

      fetchEntries(activeTab === "all" ? undefined : activeTab)
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update entry",
        variant: "destructive",
      })
    }
  }

  useEffect(() => {
    fetchEntries(activeTab === "all" ? undefined : activeTab)
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
        return `${entry.hoursWorked} hours on ${entry.date ? format(new Date(entry.date), "PP") : "N/A"}`
      case "EXPENSE":
        return `$${entry.expenseAmount} - ${entry.expenseCategory} on ${entry.date ? format(new Date(entry.date), "PP") : "N/A"}`
      case "VACATION":
        return `${entry.vacationDays} days from ${entry.startDate ? format(new Date(entry.startDate), "PP") : "N/A"} to ${entry.endDate ? format(new Date(entry.endDate), "PP") : "N/A"}`
      case "TRAVEL":
        return `${entry.travelFrom} → ${entry.travelTo} (${entry.travelKm} km) on ${entry.travelDate ? format(new Date(entry.travelDate), "PP") : "N/A"}`
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
        <TabsTrigger value="all">All</TabsTrigger>
        <TabsTrigger value="pending">Pending</TabsTrigger>
        <TabsTrigger value="approved">Approved</TabsTrigger>
        <TabsTrigger value="rejected">Rejected</TabsTrigger>
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
                <TableHead>Employee</TableHead>
                <TableHead>Details</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Submitted</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {entries.map((entry) => (
                <TableRow key={entry.id}>
                  <TableCell className="font-medium">
                    {entry.type.replace("_", " ")}
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{entry.user.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {entry.user.department || entry.user.role}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{getEntryDetails(entry)}</TableCell>
                  <TableCell>{getStatusBadge(entry.status)}</TableCell>
                  <TableCell>
                    {format(new Date(entry.createdAt), "PPP")}
                  </TableCell>
                  <TableCell className="text-right">
                    {entry.status === "PENDING" && (
                      <div className="flex justify-end gap-2">
                        <Button
                          size="sm"
                          variant="default"
                          onClick={() => updateEntryStatus(entry.id, "APPROVED")}
                        >
                          <Check className="h-4 w-4 mr-1" />
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => updateEntryStatus(entry.id, "REJECTED")}
                        >
                          <X className="h-4 w-4 mr-1" />
                          Reject
                        </Button>
                      </div>
                    )}
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

