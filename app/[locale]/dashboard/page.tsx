"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CalendarTimesheet } from "@/components/timesheet/calendar-timesheet"
import { WeeklyTimesheet } from "@/components/timesheet/weekly-timesheet"
import { EntrySidePanel } from "@/components/timesheet/entry-side-panel"
import { useTranslations } from 'next-intl'
import { useToast } from "@/hooks/use-toast"
import { isMockMode } from "@/lib/mock-data"
import { Entry, getDateRangeForMonth, getDateRangeForWeek, calculateTotalHours, calculateTotalExpenses } from "@/lib/calendar-utils"
import { Clock, DollarSign, AlertCircle } from "lucide-react"

export default function DashboardPage() {
  const t = useTranslations()
  const { toast } = useToast()
  
  const [view, setView] = useState<"monthly" | "weekly">("monthly")
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [sidePanelOpen, setSidePanelOpen] = useState(false)
  const [entries, setEntries] = useState<Entry[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [stats, setStats] = useState({
    totalHours: 0,
    totalExpenses: 0,
    pendingCount: 0,
  })

  const fetchEntries = useCallback(async () => {
    setIsLoading(true)
    try {
      const token = localStorage.getItem("token")
      if (!token && !isMockMode()) {
        throw new Error("Not authenticated")
      }

      // Get date range based on current view
      const dateRange = view === "monthly" 
        ? getDateRangeForMonth(currentDate)
        : getDateRangeForWeek(currentDate)

      const url = `/api/entries/all?startDate=${dateRange.start}&endDate=${dateRange.end}`
      
      const response = await fetch(url, {
        headers: token ? {
          Authorization: `Bearer ${token}`,
        } : {},
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "Failed to fetch entries")
      }

      setEntries(result)
      
      // Calculate stats
      const totalHours = calculateTotalHours(result)
      const totalExpenses = calculateTotalExpenses(result)
      const pendingCount = result.filter((e: Entry) => e.status === "PENDING").length

      setStats({
        totalHours,
        totalExpenses,
        pendingCount,
      })
    } catch (error: any) {
      toast({
        title: t('common.error'),
        description: error.message || "Failed to fetch entries",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }, [currentDate, view, toast, t])

  useEffect(() => {
    fetchEntries()
  }, [fetchEntries])

  const handleDateClick = (date: Date) => {
    setSelectedDate(date)
    setSidePanelOpen(true)
  }

  const handleEntryAdded = () => {
    fetchEntries()
  }

  const handleMonthChange = (date: Date) => {
    setCurrentDate(date)
  }

  const handleWeekChange = (date: Date) => {
    setCurrentDate(date)
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h1 className="text-2xl font-bold sm:text-3xl">{t('nav.dashboard')}</h1>
        <p className="text-sm text-muted-foreground sm:text-base">
          {t('timesheet.clickDateToAdd')}
        </p>
      </div>

      {/* Summary Statistics */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {view === "monthly" ? t('timesheet.thisMonth') : t('timesheet.thisWeek')}
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalHours.toFixed(1)}h</div>
            <p className="text-xs text-muted-foreground">
              {t('timesheet.totalHours')}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {view === "monthly" ? t('timesheet.thisMonth') : t('timesheet.thisWeek')}
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.totalExpenses.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              {t('timesheet.totalExpenses')}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t('timesheet.pendingApprovals')}
            </CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingCount}</div>
            <p className="text-xs text-muted-foreground">
              Awaiting review
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Calendar/Weekly View Toggle */}
      <Tabs value={view} onValueChange={(v) => setView(v as "monthly" | "weekly")}>
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="monthly">{t('timesheet.monthlyView')}</TabsTrigger>
          <TabsTrigger value="weekly">{t('timesheet.weeklyView')}</TabsTrigger>
        </TabsList>

        <TabsContent value="monthly" className="mt-6">
          {isLoading ? (
            <Card className="p-8">
              <div className="text-center text-muted-foreground">
                {t('common.loading')}
              </div>
            </Card>
          ) : (
            <CalendarTimesheet
              entries={entries}
              currentMonth={currentDate}
              onMonthChange={handleMonthChange}
              onDateClick={handleDateClick}
              selectedDate={selectedDate}
            />
          )}
        </TabsContent>

        <TabsContent value="weekly" className="mt-6">
          {isLoading ? (
            <Card className="p-8">
              <div className="text-center text-muted-foreground">
                {t('common.loading')}
              </div>
            </Card>
          ) : (
            <WeeklyTimesheet
              entries={entries}
              currentWeek={currentDate}
              onWeekChange={handleWeekChange}
              onDateClick={handleDateClick}
              selectedDate={selectedDate}
            />
          )}
        </TabsContent>
      </Tabs>

      {/* Entry Side Panel */}
      <EntrySidePanel
        open={sidePanelOpen}
        onOpenChange={setSidePanelOpen}
        selectedDate={selectedDate}
        onEntryAdded={handleEntryAdded}
      />
    </div>
  )
}
