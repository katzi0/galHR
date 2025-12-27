"use client"

import { EntryTable } from "@/components/admin/entry-table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useTranslations } from 'next-intl'

export default function AdminEntriesPage() {
  const t = useTranslations()

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h1 className="text-2xl font-bold sm:text-3xl">{t('nav.entries')}</h1>
        <p className="text-sm text-muted-foreground sm:text-base">
          Review and manage all entries
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t('admin.entryManagement')}</CardTitle>
          <CardDescription>
            Approve or reject pending entries
          </CardDescription>
        </CardHeader>
        <CardContent>
          <EntryTable />
        </CardContent>
      </Card>
    </div>
  )
}

