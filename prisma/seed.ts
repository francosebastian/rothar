import { PrismaClient } from '../src/generated/prisma'
import { hash } from 'bcryptjs'
import { UserRole } from '../src/generated/prisma'

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

const prisma = createPrismaClient()

async function main() {
  // Create admin user
  const adminPassword = await hash('admin123', 10)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@rothar.com' },
    update: {},
    create: {
      email: 'admin@rothar.com',
      name: 'Administrador',
      passwordHash: adminPassword,
      role: UserRole.ADMIN,
      phone: '123456789',
    },
  })
  console.log('Admin user created:', admin.email)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
