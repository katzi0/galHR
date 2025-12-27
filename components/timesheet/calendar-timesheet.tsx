"use client"

import { useState } from "react"
import { Calendar } from "@/components/ui/calendar"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay } from "date-fns"
import { Entry, GroupedEntries, getEntriesForDate, groupEntriesByDate } from "@/lib/calendar-utils"
import { EntryIndicators } from "./entry-indicators"
import { cn } from "@/lib/utils"

interface CalendarTimesheetProps {
  entries: Entry[]
  currentMonth: Date
  onMonthChange: (date: Date) => void
  onDateClick: (date: Date) => void
  selectedDate: Date | null
}

export function CalendarTimesheet({
  entries,
  currentMonth,
  onMonthChange,
  onDateClick,
  selectedDate,
}: CalendarTimesheetProps) {
  const groupedEntries = groupEntriesByDate(entries)
  
  // Get all dates in the current month
  const monthStart = startOfMonth(currentMonth)
  const monthEnd = endOfMonth(currentMonth)
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd })

  // Get the first day of the month to calculate offset
  const firstDayOfWeek = monthStart.getDay()
  
  // Create array with empty slots for days before month starts
  const calendarDays = Array(firstDayOfWeek).fill(null).concat(daysInMonth)

  const handlePreviousMonth = () => {
    const newDate = new Date(currentMonth)
    newDate.setMonth(newDate.getMonth() - 1)
    onMonthChange(newDate)
  }

  const handleNextMonth = () => {
    const newDate = new Date(currentMonth)
    newDate.setMonth(newDate.getMonth() + 1)
    onMonthChange(newDate)
  }

  return (
    <Card className="p-4 sm:p-6">
      {/* Header with month navigation */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl sm:text-2xl font-bold">
          {format(currentMonth, "MMMM yyyy")}
        </h2>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={handlePreviousMonth}
            aria-label="Previous month"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={handleNextMonth}
            aria-label="Next month"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1 sm:gap-2">
        {/* Day headers */}
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div
            key={day}
            className="text-center text-xs sm:text-sm font-medium text-muted-foreground py-2"
          >
            {day}
          </div>
        ))}

        {/* Calendar days */}
        {calendarDays.map((day, index) => {
          if (!day) {
            return <div key={`empty-${index}`} className="aspect-square" />
          }

          const dayEntries = getEntriesForDate(day, groupedEntries)
          const isSelected = selectedDate && isSameDay(day, selectedDate)
          const isToday = isSameDay(day, new Date())

          return (
            <button
              key={day.toISOString()}
              onClick={() => onDateClick(day)}
              className={cn(
                "relative aspect-square p-1 sm:p-2 rounded-lg border transition-colors",
                "hover:bg-accent hover:border-accent-foreground/20",
                "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
                isSelected && "bg-accent border-accent-foreground/30",
                isToday && "border-primary border-2",
                !isSameMonth(day, currentMonth) && "opacity-50"
              )}
            >
              <div className="flex flex-col h-full">
                <span
                  className={cn(
                    "text-xs sm:text-sm font-medium",
                    isToday && "text-primary font-bold"
                  )}
                >
                  {format(day, "d")}
                </span>
                <div className="flex-1" />
                <EntryIndicators entries={dayEntries} date={day} />
              </div>
            </button>
          )
        })}
      </div>

      {/* Legend */}
      <div className="mt-6 pt-4 border-t">
        <div className="flex flex-wrap gap-4 text-xs sm:text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-500" />
            <span className="text-muted-foreground">Work Hours</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500" />
            <span className="text-muted-foreground">Expenses</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-orange-500" />
            <span className="text-muted-foreground">Vacation</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-purple-500" />
            <span className="text-muted-foreground">Travel</span>
          </div>
        </div>
      </div>
    </Card>
  )
}

