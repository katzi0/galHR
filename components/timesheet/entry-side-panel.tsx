"use client"

import { useState } from "react"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { HoursForm } from "@/components/entries/hours-form"
import { ExpenseForm } from "@/components/entries/expense-form"
import { VacationForm } from "@/components/entries/vacation-form"
import { TravelForm } from "@/components/entries/travel-form"
import { format } from "date-fns"
import { useTranslations } from "next-intl"
import { Clock, DollarSign, Calendar, Plane } from "lucide-react"

interface EntrySidePanelProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  selectedDate: Date | null
  onEntryAdded?: () => void
}

export function EntrySidePanel({ open, onOpenChange, selectedDate, onEntryAdded }: EntrySidePanelProps) {
  const t = useTranslations()
  const [activeTab, setActiveTab] = useState("hours")

  const handleSuccess = () => {
    onEntryAdded?.()
    // Don't close the panel, just refresh the calendar
  }

  if (!selectedDate) return null

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-xl overflow-y-auto">
        <SheetHeader>
          <SheetTitle>{t('timesheet.addEntry')}</SheetTitle>
          <SheetDescription>
            {format(selectedDate, "EEEE, MMMM d, yyyy")}
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="hours" className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">{t('nav.workHours')}</span>
              </TabsTrigger>
              <TabsTrigger value="expenses" className="flex items-center gap-1">
                <DollarSign className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">{t('nav.expenses')}</span>
              </TabsTrigger>
              <TabsTrigger value="vacation" className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">{t('nav.vacation')}</span>
              </TabsTrigger>
              <TabsTrigger value="travel" className="flex items-center gap-1">
                <Plane className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">{t('nav.travel')}</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="hours" className="mt-6">
              <HoursFormWrapper selectedDate={selectedDate} onSuccess={handleSuccess} />
            </TabsContent>

            <TabsContent value="expenses" className="mt-6">
              <ExpenseFormWrapper selectedDate={selectedDate} onSuccess={handleSuccess} />
            </TabsContent>

            <TabsContent value="vacation" className="mt-6">
              <VacationFormWrapper selectedDate={selectedDate} onSuccess={handleSuccess} />
            </TabsContent>

            <TabsContent value="travel" className="mt-6">
              <TravelFormWrapper selectedDate={selectedDate} onSuccess={handleSuccess} />
            </TabsContent>
          </Tabs>
        </div>
      </SheetContent>
    </Sheet>
  )
}

// Wrapper components to pre-fill the date
function HoursFormWrapper({ selectedDate, onSuccess }: { selectedDate: Date; onSuccess: () => void }) {
  return <HoursForm onSuccess={onSuccess} defaultDate={selectedDate} />
}

function ExpenseFormWrapper({ selectedDate, onSuccess }: { selectedDate: Date; onSuccess: () => void }) {
  return <ExpenseForm onSuccess={onSuccess} defaultDate={selectedDate} />
}

function VacationFormWrapper({ selectedDate, onSuccess }: { selectedDate: Date; onSuccess: () => void }) {
  return <VacationForm onSuccess={onSuccess} defaultStartDate={selectedDate} />
}

function TravelFormWrapper({ selectedDate, onSuccess }: { selectedDate: Date; onSuccess: () => void }) {
  return <TravelForm onSuccess={onSuccess} defaultDate={selectedDate} />
}

