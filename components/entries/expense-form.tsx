"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { expenseEntrySchema, type ExpenseEntryInput } from "@/lib/validations"
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
import { CalendarIcon, Upload } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"
import { useTranslations } from 'next-intl'

interface ExpenseFormProps {
  onSuccess?: () => void
}

export function ExpenseForm({ onSuccess }: ExpenseFormProps) {
  const t = useTranslations()
  const [isLoading, setIsLoading] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [receiptFile, setReceiptFile] = useState<File | null>(null)
  const { toast } = useToast()

  const form = useForm<ExpenseEntryInput>({
    resolver: zodResolver(expenseEntrySchema),
    defaultValues: {
      date: new Date(),
      expenseAmount: 0,
      expenseCategory: "",
      description: "",
      receiptUrl: "",
    },
  })

  async function uploadReceipt(file: File): Promise<string> {
    const token = localStorage.getItem("token")
    if (!token) {
      throw new Error("Not authenticated")
    }

    const formData = new FormData()
    formData.append("file", file)

    const response = await fetch("/api/upload", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    })

    const result = await response.json()

    if (!response.ok) {
      throw new Error(result.error || t('forms.uploadError'))
    }

    return result.url
  }

  async function onSubmit(data: ExpenseEntryInput) {
    setIsLoading(true)
    try {
      const token = localStorage.getItem("token")
      if (!token) {
        throw new Error("Not authenticated")
      }

      // Upload receipt if provided
      let receiptUrl = data.receiptUrl
      if (receiptFile) {
        setIsUploading(true)
        receiptUrl = await uploadReceipt(receiptFile)
        setIsUploading(false)
      }

      const response = await fetch("/api/entries/expenses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...data,
          receiptUrl,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "Failed to submit expense")
      }

      toast({
        title: t('common.success'),
        description: "Expense submitted successfully",
      })

      form.reset()
      setReceiptFile(null)
      onSuccess?.()
    } catch (error: any) {
      toast({
        title: t('common.error'),
        description: error.message || "Failed to submit expense",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
      setIsUploading(false)
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
              <FormLabel>{t('expenses.date')}</FormLabel>
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
          name="expenseAmount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('expenses.amount')}</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  step="0.01"
                  placeholder={t('expenses.amountPlaceholder')}
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
          name="expenseCategory"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('expenses.category')}</FormLabel>
              <FormControl>
                <Input placeholder={t('expenses.categoryPlaceholder')} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="space-y-2">
          <FormLabel>{t('expenses.receipt')} (Optional)</FormLabel>
          <div className="flex items-center gap-2">
            <Input
              type="file"
              accept="image/*,application/pdf"
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) {
                  setReceiptFile(file)
                }
              }}
            />
            {receiptFile && (
              <span className="text-sm text-muted-foreground">
                {receiptFile.name}
              </span>
            )}
          </div>
        </div>
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('expenses.description')} (Optional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder={t('expenses.descriptionPlaceholder')}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={isLoading || isUploading}>
          {isUploading ? t('common.loading') : isLoading ? t('common.loading') : t('common.submit')}
        </Button>
      </form>
    </Form>
  )
}
