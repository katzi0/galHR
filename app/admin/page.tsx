"use client"

import { StatsCards } from "@/components/admin/stats-cards"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function AdminDashboardPage() {
  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h1 className="text-2xl font-bold sm:text-3xl">Admin Dashboard</h1>
        <p className="text-sm text-muted-foreground sm:text-base">
          Overview of system statistics and recent activity
        </p>
      </div>

      <StatsCards />

      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>
            Latest entries and user activity
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            View detailed entries in the Entries section or manage users in the Users section.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

