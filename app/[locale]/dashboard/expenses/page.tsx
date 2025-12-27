"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ExpenseForm } from "@/components/entries/expense-form"
import { EntryList } from "@/components/entries/entry-list"
import { useState } from "react"
import { useTranslations } from 'next-intl'

export default function ExpensesPage() {
  const t = useTranslations()
  const [refreshKey, setRefreshKey] = useState(0)

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h1 className="text-2xl font-bold sm:text-3xl">{t('nav.expenses')}</h1>
        <p className="text-sm text-muted-foreground sm:text-base">
          Submit your expense reports and view your submissions
        </p>
      </div>

      <div className="grid gap-4 sm:gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>{t('expenses.addExpense')}</CardTitle>
            <CardDescription>
              Submit an expense for reimbursement
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ExpenseForm onSuccess={() => setRefreshKey(prev => prev + 1)} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Your Submissions</CardTitle>
            <CardDescription>
              View all your expense reports
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

