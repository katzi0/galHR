"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Clock, DollarSign, Calendar, Plane } from "lucide-react"
import { useTranslations } from 'next-intl'

export default function DashboardPage() {
  const t = useTranslations()

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h1 className="text-2xl font-bold sm:text-3xl">{t('nav.dashboard')}</h1>
        <p className="text-sm text-muted-foreground sm:text-base">
          {t('dashboard.welcome')}! Quick actions to manage your work.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('nav.workHours')}</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <Link href="/dashboard/hours">
              <Button className="w-full">{t('hours.addHours')}</Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('nav.expenses')}</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <Link href="/dashboard/expenses">
              <Button className="w-full">{t('expenses.addExpense')}</Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('nav.vacation')}</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <Link href="/dashboard/vacation">
              <Button className="w-full">{t('vacation.requestVacation')}</Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('nav.travel')}</CardTitle>
            <Plane className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <Link href="/dashboard/travel">
              <Button className="w-full">{t('travel.addTravel')}</Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t('dashboard.recentActivity')}</CardTitle>
          <CardDescription>
            Your recent submissions and their status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            View your entries in the respective sections using the sidebar.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

