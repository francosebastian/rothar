import { PrismaClient } from '@/generated/prisma'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

function createPrismaClient() {
  const url = process.env.DATABASE_URL!

  if (process.env.VERCEL || url.includes('neon.tech')) {
    const { PrismaNeon } = require('@prisma/adapter-neon')
    const adapter = new PrismaNeon({ connectionString: url })
    return new PrismaClient({ adapter })
  }

  const { PrismaPg } = require('@prisma/adapter-pg')
  const adapter = new PrismaPg({ connectionString: url })
  return new PrismaClient({ adapter })
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
