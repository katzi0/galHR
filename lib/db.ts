import { PrismaClient } from '@prisma/client'
import { Pool } from '@neondatabase/serverless'
import { PrismaNeon } from '@prisma/adapter-neon'
import { config } from 'dotenv'

// Load environment variables for non-production environments
if (process.env.NODE_ENV !== 'production') {
  config({ path: '.env.local' })
  config()
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

function createPrismaClient() {
  // Check if we have a database URL
  const databaseUrl = process.env.DATABASE_URL || process.env.POSTGRES_URL

  if (!databaseUrl) {
    console.warn('No DATABASE_URL found, creating Prisma client without adapter')
    return new PrismaClient({
      log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    })
  }

  console.log('Creating Prisma client with database URL:', databaseUrl.substring(0, 30) + '...')

  // For Prisma Postgres (Neon), use the accelerate URL if available
  const accelerateUrl = process.env.PRISMA_DATABASE_URL
  
  if (accelerateUrl && accelerateUrl.startsWith('prisma+postgres://')) {
    console.log('Using Prisma Accelerate URL')
    // Use Prisma Accelerate - no adapter needed
    return new PrismaClient({
      datasources: {
        db: {
          url: accelerateUrl
        }
      },
      log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    })
  }
  
  // For regular Neon/Vercel Postgres, use the adapter
  try {
    console.log('Creating connection pool...')
    const pool = new Pool({ connectionString: databaseUrl })
    console.log('Creating Neon adapter...')
    const adapter = new PrismaNeon(pool as any)
    console.log('Creating Prisma client with adapter...')
    return new PrismaClient({
      adapter: adapter as any,
      log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    })
  } catch (error) {
    // Fallback if adapter fails
    console.warn('Failed to create Prisma with adapter:', error)
    console.warn('Using default client')
    return new PrismaClient({
      log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    })
  }
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

