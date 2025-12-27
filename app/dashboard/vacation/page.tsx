"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { VacationForm } from "@/components/entries/vacation-form"
import { EntryList } from "@/components/entries/entry-list"
import { useState } from "react"

export default function VacationPage() {
  const [refreshKey, setRefreshKey] = useState(0)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Vacation Requests</h1>
        <p className="text-muted-foreground">
          Request vacation time and view your submissions
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Request Vacation</CardTitle>
            <CardDescription>
              Submit a vacation request for approval
            </CardDescription>
          </CardHeader>
          <CardContent>
            <VacationForm onSuccess={() => setRefreshKey(prev => prev + 1)} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Your Requests</CardTitle>
            <CardDescription>
              View all your vacation requests
            </CardDescription>
          </CardHeader>
          <CardContent>
            <EntryList key={refreshKey} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

