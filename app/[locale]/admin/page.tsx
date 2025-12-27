"use client"

import { StatsCards } from "@/components/admin/stats-cards"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useTranslations } from 'next-intl'

export default function AdminDashboardPage() {
  const t = useTranslations()

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h1 className="text-2xl font-bold sm:text-3xl">{t('admin.title')}</h1>
        <p className="text-sm text-muted-foreground sm:text-base">
          {t('dashboard.overview')}
        </p>
      </div>

      <StatsCards />

      <Card>
        <CardHeader>
          <CardTitle>{t('dashboard.recentActivity')}</CardTitle>
          <CardDescription>
            Latest entries and user activity
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            View detailed entries in the {t('nav.entries')} section or manage users in the {t('nav.users')} section.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

