import { startOfWeek, endOfWeek, startOfMonth, endOfMonth, eachDayOfInterval, format, addWeeks, subWeeks, addMonths, subMonths, isSameDay, parseISO } from "date-fns"

export type EntryType = "WORK_HOURS" | "EXPENSE" | "VACATION" | "TRAVEL"
export type EntryStatus = "PENDING" | "APPROVED" | "REJECTED"

export interface Entry {
  id: string
  type: EntryType
  status: EntryStatus
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
}

export interface GroupedEntries {
  [dateKey: string]: Entry[]
}

/**
 * Get all dates in a month
 */
export function getMonthDates(date: Date): Date[] {
  const start = startOfMonth(date)
  const end = endOfMonth(date)
  return eachDayOfInterval({ start, end })
}

/**
 * Get all dates in a week
 */
export function getWeekDates(date: Date): Date[] {
  const start = startOfWeek(date, { weekStartsOn: 0 }) // Sunday
  const end = endOfWeek(date, { weekStartsOn: 0 })
  return eachDayOfInterval({ start, end })
}

/**
 * Navigate to next month
 */
export function getNextMonth(date: Date): Date {
  return addMonths(date, 1)
}

/**
 * Navigate to previous month
 */
export function getPreviousMonth(date: Date): Date {
  return subMonths(date, 1)
}

/**
 * Navigate to next week
 */
export function getNextWeek(date: Date): Date {
  return addWeeks(date, 1)
}

/**
 * Navigate to previous week
 */
export function getPreviousWeek(date: Date): Date {
  return subWeeks(date, 1)
}

/**
 * Get the primary date for an entry (handles different entry types)
 */
export function getEntryDate(entry: Entry): Date | null {
  if (entry.date) return parseISO(entry.date)
  if (entry.travelDate) return parseISO(entry.travelDate)
  if (entry.startDate) return parseISO(entry.startDate)
  return null
}

/**
 * Get all dates an entry spans (for vacation entries that span multiple days)
 */
export function getEntryDateRange(entry: Entry): Date[] {
  if (entry.type === "VACATION" && entry.startDate && entry.endDate) {
    const start = parseISO(entry.startDate)
    const end = parseISO(entry.endDate)
    return eachDayOfInterval({ start, end })
  }
  
  const singleDate = getEntryDate(entry)
  return singleDate ? [singleDate] : []
}

/**
 * Group entries by date
 */
export function groupEntriesByDate(entries: Entry[]): GroupedEntries {
  const grouped: GroupedEntries = {}
  
  entries.forEach(entry => {
    const dates = getEntryDateRange(entry)
    dates.forEach(date => {
      const dateKey = format(date, "yyyy-MM-dd")
      if (!grouped[dateKey]) {
        grouped[dateKey] = []
      }
      grouped[dateKey].push(entry)
    })
  })
  
  return grouped
}

/**
 * Get entries for a specific date
 */
export function getEntriesForDate(date: Date, groupedEntries: GroupedEntries): Entry[] {
  const dateKey = format(date, "yyyy-MM-dd")
  return groupedEntries[dateKey] || []
}

/**
 * Get color for entry type
 */
export function getEntryTypeColor(type: EntryType): string {
  const colors: Record<EntryType, string> = {
    WORK_HOURS: "bg-blue-500",
    EXPENSE: "bg-green-500",
    VACATION: "bg-orange-500",
    TRAVEL: "bg-purple-500",
  }
  return colors[type]
}

/**
 * Get border color for entry status
 */
export function getEntryStatusBorderColor(status: EntryStatus): string {
  const colors: Record<EntryStatus, string> = {
    PENDING: "border-yellow-400",
    APPROVED: "border-green-400",
    REJECTED: "border-red-400",
  }
  return colors[status]
}

/**
 * Get text color for entry type
 */
export function getEntryTypeTextColor(type: EntryType): string {
  const colors: Record<EntryType, string> = {
    WORK_HOURS: "text-blue-600",
    EXPENSE: "text-green-600",
    VACATION: "text-orange-600",
    TRAVEL: "text-purple-600",
  }
  return colors[type]
}

/**
 * Format entry summary for display
 */
export function formatEntrySummary(entry: Entry): string {
  switch (entry.type) {
    case "WORK_HOURS":
      return `${entry.hoursWorked || 0}h`
    case "EXPENSE":
      return `$${entry.expenseAmount || 0}`
    case "VACATION":
      return `${entry.vacationDays || 0}d`
    case "TRAVEL":
      return `${entry.travelKm || 0}km`
    default:
      return ""
  }
}

/**
 * Calculate total hours for entries
 */
export function calculateTotalHours(entries: Entry[]): number {
  return entries
    .filter(e => e.type === "WORK_HOURS" && e.hoursWorked)
    .reduce((sum, e) => sum + (e.hoursWorked || 0), 0)
}

/**
 * Calculate total expenses for entries
 */
export function calculateTotalExpenses(entries: Entry[]): number {
  return entries
    .filter(e => e.type === "EXPENSE" && e.expenseAmount)
    .reduce((sum, e) => sum + (e.expenseAmount || 0), 0)
}

/**
 * Calculate total vacation days for entries
 */
export function calculateTotalVacationDays(entries: Entry[]): number {
  return entries
    .filter(e => e.type === "VACATION" && e.vacationDays)
    .reduce((sum, e) => sum + (e.vacationDays || 0), 0)
}

/**
 * Get date range for API query
 */
export function getDateRangeForMonth(date: Date): { start: string; end: string } {
  const start = startOfMonth(date)
  const end = endOfMonth(date)
  return {
    start: format(start, "yyyy-MM-dd"),
    end: format(end, "yyyy-MM-dd"),
  }
}

/**
 * Get date range for API query (week)
 */
export function getDateRangeForWeek(date: Date): { start: string; end: string } {
  const start = startOfWeek(date, { weekStartsOn: 0 })
  const end = endOfWeek(date, { weekStartsOn: 0 })
  return {
    start: format(start, "yyyy-MM-dd"),
    end: format(end, "yyyy-MM-dd"),
  }
}

/**
 * Check if date has entries
 */
export function hasEntries(date: Date, groupedEntries: GroupedEntries): boolean {
  const dateKey = format(date, "yyyy-MM-dd")
  return !!groupedEntries[dateKey] && groupedEntries[dateKey].length > 0
}

/**
 * Get unique entry types for a date
 */
export function getEntryTypesForDate(date: Date, groupedEntries: GroupedEntries): EntryType[] {
  const entries = getEntriesForDate(date, groupedEntries)
  const types = new Set(entries.map(e => e.type))
  return Array.from(types)
}

