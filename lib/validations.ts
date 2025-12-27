import { z } from 'zod'

// Auth schemas
export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

export const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  role: z.enum(['ADMIN', 'EMPLOYEE', 'VOLUNTEER']),
  phoneNumber: z.string().optional(),
  department: z.string().optional(),
})

// Entry schemas
export const hoursEntrySchema = z.object({
  date: z.string().or(z.date()),
  hoursWorked: z.number().positive('Hours must be positive').max(24, 'Hours cannot exceed 24'),
  description: z.string().optional(),
})

export const expenseEntrySchema = z.object({
  date: z.string().or(z.date()),
  expenseAmount: z.number().positive('Amount must be positive'),
  expenseCategory: z.string().min(1, 'Category is required'),
  description: z.string().optional(),
  receiptUrl: z.string().url('Invalid receipt URL').optional(),
})

export const vacationEntrySchema = z.object({
  startDate: z.string().or(z.date()),
  endDate: z.string().or(z.date()),
  vacationDays: z.number().int().positive('Days must be positive'),
  description: z.string().optional(),
}).refine(data => {
  const start = new Date(data.startDate)
  const end = new Date(data.endDate)
  return end >= start
}, {
  message: 'End date must be after start date',
  path: ['endDate'],
})

export const travelEntrySchema = z.object({
  travelDate: z.string().or(z.date()),
  travelFrom: z.string().min(1, 'Origin is required'),
  travelTo: z.string().min(1, 'Destination is required'),
  travelKm: z.number().positive('Distance must be positive'),
  description: z.string().optional(),
})

export type LoginInput = z.infer<typeof loginSchema>
export type RegisterInput = z.infer<typeof registerSchema>
export type HoursEntryInput = z.infer<typeof hoursEntrySchema>
export type ExpenseEntryInput = z.infer<typeof expenseEntrySchema>
export type VacationEntryInput = z.infer<typeof vacationEntrySchema>
export type TravelEntryInput = z.infer<typeof travelEntrySchema>

