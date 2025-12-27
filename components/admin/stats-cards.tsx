"use client"

import { useEffect, useState, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Clock, DollarSign, FileCheck, AlertCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { isMockMode, getMockStats } from "@/lib/mock-data"
import { useTranslations } from 'next-intl'

interface Stats {
  users: {
    total: number
    admin: number
    employee: number
    volunteer: number
  }
  entries: {
    pending: number
    approvedThisMonth: number
  }
  thisMonth: {
    totalHours: number
    totalExpenses: number
  }
}

export function StatsCards() {
  const t = useTranslations()
  const [stats, setStats] = useState<Stats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  const fetchStats = useCallback(async () => {
    setIsLoading(true)
    try {
      // Check if mock mode is enabled
      if (isMockMode()) {
        // Use mock data
        await new Promise(resolve => setTimeout(resolve, 300)) // Simulate loading
        setStats(getMockStats())
        setIsLoading(false)
        return
      }

      const token = localStorage.getItem("token")
      if (!token) {
        throw new Error("Not authenticated")
      }

      const response = await fetch("/api/admin/stats", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "Failed to fetch stats")
      }

      setStats(result)
    } catch (error: any) {
      toast({
        title: t('common.error'),
        description: error.message || "Failed to fetch statistics",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }, [toast, t])

  useEffect(() => {
    fetchStats()
  }, [fetchStats])

  if (isLoading) {
    return <div className="text-center py-8">{t('common.loading')}</div>
  }

  if (!stats) {
    return null
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{t('admin.totalUsers')}</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.users.total}</div>
          <p className="text-xs text-muted-foreground">
            {stats.users.admin} admin, {stats.users.employee} employees,{" "}
            {stats.users.volunteer} volunteers
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{t('admin.pendingEntries')}</CardTitle>
          <AlertCircle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.entries.pending}</div>
          <p className="text-xs text-muted-foreground">
            Awaiting approval
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            {t('hours.title')} {t('admin.thisMonth')}
          </CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {stats.thisMonth.totalHours.toFixed(1)}
          </div>
          <p className="text-xs text-muted-foreground">
            Approved work hours
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            {t('expenses.title')} {t('admin.thisMonth')}
          </CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            ${stats.thisMonth.totalExpenses.toFixed(2)}
          </div>
          <p className="text-xs text-muted-foreground">
            Approved expenses
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            {t('admin.approvedEntries')} {t('admin.thisMonth')}
          </CardTitle>
          <FileCheck className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {stats.entries.approvedThisMonth}
          </div>
          <p className="text-xs text-muted-foreground">
            Total approved entries
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
