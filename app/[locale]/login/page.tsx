"use client"

import Link from "next/link"
import { LoginForm } from "@/components/auth/login-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Info } from "lucide-react"
import { useEffect, useState } from "react"
import { useTranslations } from 'next-intl'

export default function LoginPage() {
  const t = useTranslations()
  const [isDemoMode, setIsDemoMode] = useState(false)

  useEffect(() => {
    setIsDemoMode(localStorage.getItem('mockMode') === 'true')
  }, [])

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl">{t('auth.login')}</CardTitle>
          <CardDescription className="text-sm">
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isDemoMode && (
            <Alert className="mb-4">
              <Info className="h-4 w-4" />
              <AlertDescription>
                Demo mode is active. You can login with any credentials to explore the admin dashboard.
              </AlertDescription>
            </Alert>
          )}
          <LoginForm />
          <div className="mt-4 text-center text-sm">
            {t('auth.dontHaveAccount')}{" "}
            <Link href="/register" className="text-primary hover:underline font-medium">
              {t('auth.register')}
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

