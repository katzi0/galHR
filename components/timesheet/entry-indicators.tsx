"use client"

import { Entry, getEntryTypeColor, formatEntrySummary, getEntryStatusBorderColor } from "@/lib/calendar-utils"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { Clock, DollarSign, Calendar, Plane } from "lucide-react"

interface EntryIndicatorsProps {
  entries: Entry[]
  date: Date
}

export function EntryIndicators({ entries, date }: EntryIndicatorsProps) {
  if (entries.length === 0) return null

  // Get unique entry types
  const uniqueTypes = Array.from(new Set(entries.map(e => e.type)))

  return (
    <HoverCard openDelay={200}>
      <HoverCardTrigger asChild>
        <div className="flex gap-0.5 justify-center mt-1 cursor-pointer">
          {uniqueTypes.slice(0, 4).map((type, idx) => (
            <div
              key={`${type}-${idx}`}
              className={`w-1.5 h-1.5 rounded-full ${getEntryTypeColor(type)}`}
            />
          ))}
        </div>
      </HoverCardTrigger>
      <HoverCardContent className="w-80" side="top" align="center">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-semibold">
              {format(date, "MMMM d, yyyy")}
            </h4>
            <span className="text-xs text-muted-foreground">
              {entries.length} {entries.length === 1 ? "entry" : "entries"}
            </span>
          </div>
          <div className="space-y-2">
            {entries.map((entry) => (
              <EntryItem key={entry.id} entry={entry} />
            ))}
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  )
}

function EntryItem({ entry }: { entry: Entry }) {
  const getIcon = () => {
    switch (entry.type) {
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

  const getStatusBadge = () => {
    const variants: Record<string, "default" | "secondary" | "destructive"> = {
      PENDING: "secondary",
      APPROVED: "default",
      REJECTED: "destructive",
    }
    return (
      <Badge variant={variants[entry.status] || "default"} className="text-xs px-1.5 py-0">
        {entry.status}
      </Badge>
    )
  }

  const getDetails = () => {
    switch (entry.type) {
      case "WORK_HOURS":
        return (
          <div className="text-xs">
            <span className="font-medium">{entry.hoursWorked}h</span>
            {entry.description && (
              <span className="text-muted-foreground ml-1">- {entry.description}</span>
            )}
          </div>
        )
      case "EXPENSE":
        return (
          <div className="text-xs">
            <span className="font-medium">${entry.expenseAmount}</span>
            {entry.expenseCategory && (
              <span className="text-muted-foreground ml-1">- {entry.expenseCategory}</span>
            )}
          </div>
        )
      case "VACATION":
        return (
          <div className="text-xs">
            <span className="font-medium">{entry.vacationDays} days</span>
            {entry.startDate && entry.endDate && (
              <span className="text-muted-foreground ml-1">
                ({format(new Date(entry.startDate), "MMM d")} - {format(new Date(entry.endDate), "MMM d")})
              </span>
            )}
          </div>
        )
      case "TRAVEL":
        return (
          <div className="text-xs">
            <span className="font-medium">{entry.travelKm}km</span>
            {entry.travelFrom && entry.travelTo && (
              <span className="text-muted-foreground ml-1">
                {entry.travelFrom} → {entry.travelTo}
              </span>
            )}
          </div>
        )
    }
  }

  return (
    <div className={`flex items-start gap-2 p-2 rounded-md border-l-2 ${getEntryStatusBorderColor(entry.status)} bg-muted/50`}>
      <div className={`mt-0.5 ${getEntryTypeColor(entry.type)} p-1 rounded`}>
        {getIcon()}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs font-medium">
            {entry.type.replace("_", " ")}
          </span>
          {getStatusBadge()}
        </div>
        {getDetails()}
      </div>
    </div>
  )
}

