// Mock data for demo purposes
import { addDays, subDays, startOfMonth } from 'date-fns'

export interface MockUser {
  id: string
  name: string
  email: string
  role: 'ADMIN' | 'EMPLOYEE' | 'VOLUNTEER'
  department?: string
  phoneNumber?: string
  createdAt: string
  _count: {
    entries: number
  }
}

export interface MockEntry {
  id: string
  userId?: string
  type: string
  status: string
  date?: string
  hoursWorked?: number
  expenseAmount?: number
  expenseCategory?: string
  startDate?: string
  endDate?: string
  vacationDays?: number
  travelDate?: string
  travelFrom?: string
  travelTo?: string
  travelKm?: number
  description?: string
  createdAt: string
  user: {
    id: string
    name: string
    email: string
    role: string
    department?: string
  }
}

export interface MockStats {
  users: {
    total: number
    admin: number
    employee: number
    volunteer: number
  }
  entries: {
    pending: number
    approvedThisMonth: number
  }
  thisMonth: {
    totalHours: number
    totalExpenses: number
  }
}

// Generate mock users
export const mockUsers: MockUser[] = [
  {
    id: '1',
    name: 'Admin User',
    email: 'admin@example.com',
    role: 'ADMIN',
    department: 'Management',
    phoneNumber: '+1234567890',
    createdAt: subDays(new Date(), 365).toISOString(),
    _count: { entries: 0 },
  },
  {
    id: '2',
    name: 'John Doe',
    email: 'john@example.com',
    role: 'EMPLOYEE',
    department: 'Engineering',
    phoneNumber: '+1234567891',
    createdAt: subDays(new Date(), 180).toISOString(),
    _count: { entries: 24 },
  },
  {
    id: '3',
    name: 'Jane Smith',
    email: 'jane@example.com',
    role: 'EMPLOYEE',
    department: 'Marketing',
    phoneNumber: '+1234567892',
    createdAt: subDays(new Date(), 150).toISOString(),
    _count: { entries: 18 },
  },
  {
    id: '4',
    name: 'Bob Johnson',
    email: 'bob@example.com',
    role: 'EMPLOYEE',
    department: 'Sales',
    phoneNumber: '+1234567893',
    createdAt: subDays(new Date(), 120).toISOString(),
    _count: { entries: 32 },
  },
  {
    id: '5',
    name: 'Alice Williams',
    email: 'alice@example.com',
    role: 'EMPLOYEE',
    department: 'Engineering',
    phoneNumber: '+1234567894',
    createdAt: subDays(new Date(), 90).toISOString(),
    _count: { entries: 15 },
  },
  {
    id: '6',
    name: 'Charlie Brown',
    email: 'charlie@example.com',
    role: 'VOLUNTEER',
    phoneNumber: '+1234567895',
    createdAt: subDays(new Date(), 60).toISOString(),
    _count: { entries: 8 },
  },
  {
    id: '7',
    name: 'Diana Prince',
    email: 'diana@example.com',
    role: 'EMPLOYEE',
    department: 'HR',
    phoneNumber: '+1234567896',
    createdAt: subDays(new Date(), 45).toISOString(),
    _count: { entries: 12 },
  },
  {
    id: '8',
    name: 'Eva Martinez',
    email: 'eva@example.com',
    role: 'VOLUNTEER',
    phoneNumber: '+1234567897',
    createdAt: subDays(new Date(), 30).toISOString(),
    _count: { entries: 5 },
  },
]

// Helper function to convert MockUser to entry user format
function toEntryUser(mockUser: MockUser): { id: string; name: string; email: string; role: string; department?: string } {
  return {
    id: mockUser.id,
    name: mockUser.name,
    email: mockUser.email,
    role: mockUser.role,
    department: mockUser.department,
  }
}

// Generate mock entries
export const mockEntries: MockEntry[] = [
  // Recent pending entries
  {
    id: '1',
    userId: '2',
    type: 'WORK_HOURS',
    status: 'PENDING',
    date: subDays(new Date(), 1).toISOString(),
    hoursWorked: 8,
    description: 'Worked on new feature implementation',
    createdAt: subDays(new Date(), 1).toISOString(),
    user: toEntryUser(mockUsers[1]),
  },
  {
    id: '2',
    userId: '3',
    type: 'EXPENSE',
    status: 'PENDING',
    date: subDays(new Date(), 2).toISOString(),
    expenseAmount: 125.50,
    expenseCategory: 'Client Meeting',
    description: 'Lunch with potential client',
    createdAt: subDays(new Date(), 2).toISOString(),
    user: toEntryUser(mockUsers[2]),
  },
  {
    id: '3',
    userId: '4',
    type: 'TRAVEL',
    status: 'PENDING',
    travelDate: subDays(new Date(), 1).toISOString(),
    travelFrom: 'Main Office',
    travelTo: 'Client Site Downtown',
    travelKm: 45.5,
    description: 'Sales presentation',
    createdAt: subDays(new Date(), 1).toISOString(),
    user: toEntryUser(mockUsers[3]),
  },
  {
    id: '4',
    userId: '5',
    type: 'VACATION',
    status: 'PENDING',
    startDate: addDays(new Date(), 14).toISOString(),
    endDate: addDays(new Date(), 18).toISOString(),
    vacationDays: 5,
    description: 'Family vacation to Hawaii',
    createdAt: subDays(new Date(), 3).toISOString(),
    user: toEntryUser(mockUsers[4]),
  },
  {
    id: '5',
    userId: '6',
    type: 'WORK_HOURS',
    status: 'PENDING',
    date: subDays(new Date(), 2).toISOString(),
    hoursWorked: 4,
    description: 'Community event organization',
    createdAt: subDays(new Date(), 2).toISOString(),
    user: toEntryUser(mockUsers[5]),
  },
  
  // Approved entries this month
  {
    id: '6',
    userId: '2',
    type: 'WORK_HOURS',
    status: 'APPROVED',
    date: subDays(new Date(), 5).toISOString(),
    hoursWorked: 8.5,
    description: 'Code review and bug fixes',
    createdAt: subDays(new Date(), 5).toISOString(),
    user: toEntryUser(mockUsers[1]),
  },
  {
    id: '7',
    userId: '2',
    type: 'WORK_HOURS',
    status: 'APPROVED',
    date: subDays(new Date(), 6).toISOString(),
    hoursWorked: 9,
    description: 'Sprint planning and development',
    createdAt: subDays(new Date(), 6).toISOString(),
    user: toEntryUser(mockUsers[1]),
  },
  {
    id: '8',
    userId: '3',
    type: 'WORK_HOURS',
    status: 'APPROVED',
    date: subDays(new Date(), 4).toISOString(),
    hoursWorked: 7.5,
    description: 'Marketing campaign planning',
    createdAt: subDays(new Date(), 4).toISOString(),
    user: toEntryUser(mockUsers[2]),
  },
  {
    id: '9',
    userId: '3',
    type: 'EXPENSE',
    status: 'APPROVED',
    date: subDays(new Date(), 7).toISOString(),
    expenseAmount: 89.99,
    expenseCategory: 'Office Supplies',
    description: 'Marketing materials and supplies',
    createdAt: subDays(new Date(), 7).toISOString(),
    user: toEntryUser(mockUsers[2]),
  },
  {
    id: '10',
    userId: '4',
    type: 'WORK_HOURS',
    status: 'APPROVED',
    date: subDays(new Date(), 3).toISOString(),
    hoursWorked: 8,
    description: 'Client calls and proposal writing',
    createdAt: subDays(new Date(), 3).toISOString(),
    user: toEntryUser(mockUsers[3]),
  },
  {
    id: '11',
    userId: '4',
    type: 'EXPENSE',
    status: 'APPROVED',
    date: subDays(new Date(), 8).toISOString(),
    expenseAmount: 250.00,
    expenseCategory: 'Client Meeting',
    description: 'Dinner with major client',
    createdAt: subDays(new Date(), 8).toISOString(),
    user: toEntryUser(mockUsers[3]),
  },
  {
    id: '12',
    userId: '5',
    type: 'WORK_HOURS',
    status: 'APPROVED',
    date: subDays(new Date(), 4).toISOString(),
    hoursWorked: 7,
    description: 'Database optimization',
    createdAt: subDays(new Date(), 4).toISOString(),
    user: toEntryUser(mockUsers[4]),
  },
  {
    id: '13',
    userId: '7',
    type: 'WORK_HOURS',
    status: 'APPROVED',
    date: subDays(new Date(), 5).toISOString(),
    hoursWorked: 8,
    description: 'Employee onboarding and training',
    createdAt: subDays(new Date(), 5).toISOString(),
    user: toEntryUser(mockUsers[6]),
  },
  {
    id: '14',
    userId: '7',
    type: 'EXPENSE',
    status: 'APPROVED',
    date: subDays(new Date(), 10).toISOString(),
    expenseAmount: 45.00,
    expenseCategory: 'Office Supplies',
    description: 'HR forms and folders',
    createdAt: subDays(new Date(), 10).toISOString(),
    user: toEntryUser(mockUsers[6]),
  },
  {
    id: '15',
    userId: '4',
    type: 'TRAVEL',
    status: 'APPROVED',
    travelDate: subDays(new Date(), 9).toISOString(),
    travelFrom: 'Main Office',
    travelTo: 'Regional Office',
    travelKm: 120.5,
    description: 'Quarterly sales meeting',
    createdAt: subDays(new Date(), 9).toISOString(),
    user: toEntryUser(mockUsers[3]),
  },
  
  // Some rejected entries
  {
    id: '16',
    userId: '3',
    type: 'EXPENSE',
    status: 'REJECTED',
    date: subDays(new Date(), 12).toISOString(),
    expenseAmount: 500.00,
    expenseCategory: 'Equipment',
    description: 'Personal laptop purchase',
    createdAt: subDays(new Date(), 12).toISOString(),
    user: toEntryUser(mockUsers[2]),
  },
  {
    id: '17',
    userId: '6',
    type: 'VACATION',
    status: 'REJECTED',
    startDate: subDays(new Date(), 2).toISOString(),
    endDate: addDays(new Date(), 3).toISOString(),
    vacationDays: 5,
    description: 'Last minute vacation request',
    createdAt: subDays(new Date(), 3).toISOString(),
    user: toEntryUser(mockUsers[5]),
  },
  
  // More approved entries for stats
  {
    id: '18',
    userId: '2',
    type: 'WORK_HOURS',
    status: 'APPROVED',
    date: subDays(new Date(), 10).toISOString(),
    hoursWorked: 8,
    description: 'Feature development',
    createdAt: subDays(new Date(), 10).toISOString(),
    user: toEntryUser(mockUsers[1]),
  },
  {
    id: '19',
    userId: '5',
    type: 'WORK_HOURS',
    status: 'APPROVED',
    date: subDays(new Date(), 11).toISOString(),
    hoursWorked: 9,
    description: 'System maintenance',
    createdAt: subDays(new Date(), 11).toISOString(),
    user: toEntryUser(mockUsers[4]),
  },
  {
    id: '20',
    userId: '7',
    type: 'WORK_HOURS',
    status: 'APPROVED',
    date: subDays(new Date(), 12).toISOString(),
    hoursWorked: 7.5,
    description: 'Policy documentation',
    createdAt: subDays(new Date(), 12).toISOString(),
    user: toEntryUser(mockUsers[6]),
  },
]

// Calculate mock stats
export const mockStats: MockStats = {
  users: {
    total: mockUsers.length,
    admin: mockUsers.filter(u => u.role === 'ADMIN').length,
    employee: mockUsers.filter(u => u.role === 'EMPLOYEE').length,
    volunteer: mockUsers.filter(u => u.role === 'VOLUNTEER').length,
  },
  entries: {
    pending: mockEntries.filter(e => e.status === 'PENDING').length,
    approvedThisMonth: mockEntries.filter(e => 
      e.status === 'APPROVED' && 
      new Date(e.createdAt) >= startOfMonth(new Date())
    ).length,
  },
  thisMonth: {
    totalHours: mockEntries
      .filter(e => 
        e.status === 'APPROVED' && 
        e.type === 'WORK_HOURS' &&
        new Date(e.createdAt) >= startOfMonth(new Date())
      )
      .reduce((sum, e) => sum + (e.hoursWorked || 0), 0),
    totalExpenses: mockEntries
      .filter(e => 
        e.status === 'APPROVED' && 
        e.type === 'EXPENSE' &&
        new Date(e.createdAt) >= startOfMonth(new Date())
      )
      .reduce((sum, e) => sum + (e.expenseAmount || 0), 0),
  },
}

// Helper functions to get mock data
export function getMockUsers(): MockUser[] {
  return mockUsers
}

export function getMockEntries(filters?: {
  status?: string
  type?: string
  userId?: string
}): MockEntry[] {
  let filtered = [...mockEntries]
  
  if (filters?.status && filters.status !== 'all') {
    filtered = filtered.filter(e => e.status === filters.status?.toUpperCase())
  }
  
  if (filters?.type) {
    filtered = filtered.filter(e => e.type === filters.type?.toUpperCase())
  }
  
  if (filters?.userId) {
    filtered = filtered.filter(e => e.userId === filters.userId)
  }
  
  return filtered.sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )
}

export function getMockStats(): MockStats {
  return mockStats
}

export function getMockCurrentUser(): { userId: string; role: string; name: string } {
  // Return a mock admin user for demo
  return {
    userId: '1',
    role: 'ADMIN',
    name: 'Admin User',
  }
}

// Check if mock mode is enabled
export function isMockMode(): boolean {
  if (typeof window === 'undefined') return false
  return localStorage.getItem('mockMode') === 'true'
}

// Toggle mock mode
export function setMockMode(enabled: boolean): void {
  if (typeof window === 'undefined') return
  localStorage.setItem('mockMode', enabled ? 'true' : 'false')
}

