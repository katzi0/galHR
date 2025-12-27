"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, ChevronRight, Clock, DollarSign, Calendar, Plane } from "lucide-react"
import { format, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay, isToday } from "date-fns"
import { Entry, getEntriesForDate, groupEntriesByDate, calculateTotalHours, calculateTotalExpenses, getEntryTypeColor, getEntryStatusBorderColor } from "@/lib/calendar-utils"
import { cn } from "@/lib/utils"
import { useTranslations } from "next-intl"

interface WeeklyTimesheetProps {
  entries: Entry[]
  currentWeek: Date
  onWeekChange: (date: Date) => void
  onDateClick: (date: Date) => void
  selectedDate: Date | null
}

export function WeeklyTimesheet({
  entries,
  currentWeek,
  onWeekChange,
  onDateClick,
  selectedDate,
}: WeeklyTimesheetProps) {
  const t = useTranslations()
  const groupedEntries = groupEntriesByDate(entries)
  
  // Get all dates in the current week
  const weekStart = startOfWeek(currentWeek, { weekStartsOn: 0 })
  const weekEnd = endOfWeek(currentWeek, { weekStartsOn: 0 })
  const daysInWeek = eachDayOfInterval({ start: weekStart, end: weekEnd })

  // Calculate totals for the week
  const totalHours = calculateTotalHours(entries)
  const totalExpenses = calculateTotalExpenses(entries)

  const handlePreviousWeek = () => {
    const newDate = new Date(currentWeek)
    newDate.setDate(newDate.getDate() - 7)
    onWeekChange(newDate)
  }

  const handleNextWeek = () => {
    const newDate = new Date(currentWeek)
    newDate.setDate(newDate.getDate() + 7)
    onWeekChange(newDate)
  }

  const getIcon = (type: string) => {
    switch (type) {
      case "WORK_HOURS":
        return <Clock className="h-3.5 w-3.5" />
      case "EXPENSE":
        return <DollarSign className="h-3.5 w-3.5" />
      case "VACATION":
        return <Calendar className="h-3.5 w-3.5" />
      case "TRAVEL":
        return <Plane className="h-3.5 w-3.5" />
    }
  }

  return (
    <Card className="p-4 sm:p-6">
      {/* Header with week navigation */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold">
            {t('timesheet.weekOf')} {format(weekStart, "MMM d")} - {format(weekEnd, "MMM d, yyyy")}
          </h2>
          <div className="flex gap-4 mt-2 text-sm text-muted-foreground">
            <span>{t('timesheet.totalHours')}: <strong>{totalHours.toFixed(1)}h</strong></span>
            <span>{t('timesheet.totalExpenses')}: <strong>${totalExpenses.toFixed(2)}</strong></span>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={handlePreviousWeek}
            aria-label="Previous week"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={handleNextWeek}
            aria-label="Next week"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Weekly grid */}
      <div className="grid grid-cols-1 md:grid-cols-7 gap-3 sm:gap-4">
        {daysInWeek.map((day) => {
          const dayEntries = getEntriesForDate(day, groupedEntries)
          const isSelected = selectedDate && isSameDay(day, selectedDate)
          const isDayToday = isToday(day)

          return (
            <button
              key={day.toISOString()}
              onClick={() => onDateClick(day)}
              className={cn(
                "text-left p-3 sm:p-4 rounded-lg border transition-colors",
                "hover:bg-accent hover:border-accent-foreground/20",
                "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
                isSelected && "bg-accent border-accent-foreground/30",
                isDayToday && "border-primary border-2"
              )}
            >
              {/* Day header */}
              <div className="mb-3">
                <div className={cn(
                  "text-xs font-medium text-muted-foreground",
                  isDayToday && "text-primary"
                )}>
                  {format(day, "EEE")}
                </div>
                <div className={cn(
                  "text-lg font-bold",
                  isDayToday && "text-primary"
                )}>
                  {format(day, "d")}
                </div>
              </div>

              {/* Entries for this day */}
              <div className="space-y-2">
                {dayEntries.length === 0 ? (
                  <div className="text-xs text-muted-foreground italic">
                    {t('timesheet.noEntriesForDate')}
                  </div>
                ) : (
                  dayEntries.map((entry) => (
                    <div
                      key={entry.id}
                      className={cn(
                        "flex items-start gap-2 p-2 rounded border-l-2 bg-muted/50 text-xs",
                        getEntryStatusBorderColor(entry.status)
                      )}
                    >
                      <div className={`${getEntryTypeColor(entry.type)} p-1 rounded flex-shrink-0`}>
                        {getIcon(entry.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium truncate">
                          {entry.type === "WORK_HOURS" && `${entry.hoursWorked}h`}
                          {entry.type === "EXPENSE" && `$${entry.expenseAmount}`}
                          {entry.type === "VACATION" && `${entry.vacationDays}d`}
                          {entry.type === "TRAVEL" && `${entry.travelKm}km`}
                        </div>
                        {entry.description && (
                          <div className="text-muted-foreground truncate text-xs mt-0.5">
                            {entry.description}
                          </div>
                        )}
                        <Badge
                          variant={
                            entry.status === "APPROVED"
                              ? "default"
                              : entry.status === "REJECTED"
                              ? "destructive"
                              : "secondary"
                          }
                          className="text-xs px-1 py-0 mt-1"
                        >
                          {entry.status}
                        </Badge>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </button>
          )
        })}
      </div>
    </Card>
  )
}

