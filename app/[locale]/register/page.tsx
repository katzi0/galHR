"use client"

import Link from "next/link"
import { RegisterForm } from "@/components/auth/register-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useTranslations } from 'next-intl'

export default function RegisterPage() {
  const t = useTranslations()

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl">{t('auth.register')}</CardTitle>
          <CardDescription className="text-sm">
            Create a new account to get started
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RegisterForm />
          <div className="mt-4 text-center text-sm">
            {t('auth.alreadyHaveAccount')}{" "}
            <Link href="/login" className="text-primary hover:underline font-medium">
              {t('auth.login')}
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

