"use client"

import { EntryTable } from "@/components/admin/entry-table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function AdminEntriesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Entries</h1>
        <p className="text-muted-foreground">
          Review and manage all entries
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Entries</CardTitle>
          <CardDescription>
            Approve or reject pending entries
          </CardDescription>
        </CardHeader>
        <CardContent>
          <EntryTable />
        </CardContent>
      </Card>
    </div>
  )
}

