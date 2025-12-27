import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Prisma 7 requires either an adapter or accelerateUrl
// Use PRISMA_DATABASE_URL (Accelerate URL) if available, otherwise DATABASE_URL
const accelerateUrl = process.env.PRISMA_DATABASE_URL
const databaseUrl = process.env.DATABASE_URL || process.env.POSTGRES_URL

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    // @ts-ignore - Prisma 7 typing issue
    ...(accelerateUrl ? { accelerateUrl } : {}),
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

