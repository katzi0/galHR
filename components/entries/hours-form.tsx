"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { hoursEntrySchema, type HoursEntryInput } from "@/lib/validations"
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
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"
import { useTranslations } from 'next-intl'

interface HoursFormProps {
  onSuccess?: () => void
}

export function HoursForm({ onSuccess }: HoursFormProps) {
  const t = useTranslations()
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const form = useForm<HoursEntryInput>({
    resolver: zodResolver(hoursEntrySchema),
    defaultValues: {
      date: new Date(),
      hoursWorked: 0,
      description: "",
    },
  })

  async function onSubmit(data: HoursEntryInput) {
    setIsLoading(true)
    try {
      const token = localStorage.getItem("token")
      if (!token) {
        throw new Error("Not authenticated")
      }

      const response = await fetch("/api/entries/hours", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "Failed to submit hours")
      }

      toast({
        title: t('common.success'),
        description: "Work hours submitted successfully",
      })

      form.reset()
      onSuccess?.()
    } catch (error: any) {
      toast({
        title: t('common.error'),
        description: error.message || "Failed to submit hours",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6">
        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>{t('hours.date')}</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(new Date(field.value), "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={new Date(field.value)}
                    onSelect={field.onChange}
                    disabled={(date) =>
                      date > new Date() || date < new Date("1900-01-01")
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="hoursWorked"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('hours.hours')}</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  step="0.5"
                  placeholder={t('hours.hoursPlaceholder')}
                  {...field}
                  onChange={(e) => field.onChange(parseFloat(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('hours.description')} (Optional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder={t('hours.descriptionPlaceholder')}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? t('common.loading') : t('common.submit')}
        </Button>
      </form>
    </Form>
  )
}
