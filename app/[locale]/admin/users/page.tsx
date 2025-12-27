"use client"

import { UserTable } from "@/components/admin/user-table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useTranslations } from 'next-intl'

export default function AdminUsersPage() {
  const t = useTranslations()

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h1 className="text-2xl font-bold sm:text-3xl">{t('nav.users')}</h1>
        <p className="text-sm text-muted-foreground sm:text-base">
          Manage all users in the system
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t('admin.userManagement')}</CardTitle>
          <CardDescription>
            View and manage user accounts
          </CardDescription>
        </CardHeader>
        <CardContent>
          <UserTable />
        </CardContent>
      </Card>
    </div>
  )
}

