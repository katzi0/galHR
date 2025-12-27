"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TravelForm } from "@/components/entries/travel-form"
import { EntryList } from "@/components/entries/entry-list"
import { useState } from "react"
import { useTranslations } from 'next-intl'

export default function TravelPage() {
  const t = useTranslations()
  const [refreshKey, setRefreshKey] = useState(0)

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h1 className="text-2xl font-bold sm:text-3xl">{t('nav.travel')}</h1>
        <p className="text-sm text-muted-foreground sm:text-base">
          Submit your travel reports and view your submissions
        </p>
      </div>

      <div className="grid gap-4 sm:gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>{t('travel.addTravel')}</CardTitle>
            <CardDescription>
              Submit a travel report for reimbursement
            </CardDescription>
          </CardHeader>
          <CardContent>
            <TravelForm onSuccess={() => setRefreshKey(prev => prev + 1)} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Your Reports</CardTitle>
            <CardDescription>
              View all your travel reports
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

