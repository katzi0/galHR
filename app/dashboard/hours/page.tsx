"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { HoursForm } from "@/components/entries/hours-form"
import { EntryList } from "@/components/entries/entry-list"
import { useState } from "react"

export default function HoursPage() {
  const [refreshKey, setRefreshKey] = useState(0)

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h1 className="text-2xl font-bold sm:text-3xl">Work Hours</h1>
        <p className="text-sm text-muted-foreground sm:text-base">
          Submit your work hours and view your submissions
        </p>
      </div>

      <div className="grid gap-4 sm:gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Submit Hours</CardTitle>
            <CardDescription>
              Record your work hours for approval
            </CardDescription>
          </CardHeader>
          <CardContent>
            <HoursForm onSuccess={() => setRefreshKey(prev => prev + 1)} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Your Submissions</CardTitle>
            <CardDescription>
              View all your work hour entries
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

