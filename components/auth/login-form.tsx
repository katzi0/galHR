"use client"

import { useState } from "react"
import { useRouter } from "@/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { loginSchema, type LoginInput } from "@/lib/validations"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { useTranslations } from 'next-intl'

export function LoginForm() {
  const t = useTranslations()
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  async function onSubmit(data: LoginInput) {
    setIsLoading(true)
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || t('auth.loginError'))
      }

      // Save token to localStorage
      localStorage.setItem("token", result.token)
      localStorage.setItem("user", JSON.stringify(result.user))

      toast({
        title: t('common.success'),
        description: t('auth.loginSuccess'),
      })

      // Redirect based on role
      if (result.user.role === "ADMIN") {
        router.push("/admin")
      } else {
        router.push("/dashboard")
      }
    } catch (error: any) {
      toast({
        title: t('common.error'),
        description: error.message || t('auth.loginError'),
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('auth.email')}</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder={t('auth.emailPlaceholder')}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('auth.password')}</FormLabel>
              <FormControl>
                <Input type="password" placeholder={t('auth.passwordPlaceholder')} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? t('auth.loggingIn') : t('auth.login')}
        </Button>
      </form>
    </Form>
  )
}
