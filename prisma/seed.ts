import { PrismaClient } from '../src/generated/prisma'
import { hash } from 'bcryptjs'
import { UserRole } from '../src/generated/prisma'
import { PrismaPg } from '@prisma/adapter-pg'

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
})

const prisma = new PrismaClient({ adapter })

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

  // Migrate existing products from static data
  const products = [
    {
      name: 'Cadena Shimano CN-HG40',
      price: 15000,
      category: 'Transmisión',
      image: '/images/products/cadena.jpg',
      description: 'Cadena de alta calidad para transmisión de 6/7/8 velocidades.',
      stock: 50,
      sku: 'CHAIN-001',
      featured: true,
    },
    {
      name: 'Freno V-Brake Shimano BR-T4000',
      price: 28000,
      category: 'Frenos',
      image: '/images/products/freno.jpg',
      description: 'Freno V-Brake duradero para frenado seguro en ciudad.',
      stock: 30,
      sku: 'BRAKE-001',
      featured: true,
    },
    {
      name: 'Cubierta Kenda Kwick Trax 700x32',
      price: 22000,
      category: 'Ruedas',
      image: '/images/products/cubierta.jpg',
      description: 'Cubierta multitrack para ciudad y caminos mixtos.',
      stock: 40,
      sku: 'TIRE-001',
      featured: true,
    },
    {
      name: 'Manubrio Rise Bar 31.8mm',
      price: 18000,
      category: 'Dirección',
      image: '/images/products/manubrio.jpg',
      description: 'Manubrio cómodo para posición erguida en ciudad.',
      stock: 25,
      sku: 'HANDLE-001',
      featured: false,
    },
    {
      name: 'Sillín Ergonómico Selle Royal',
      price: 35000,
      category: 'Sillín',
      image: '/images/products/sillin.jpg',
      description: 'Sillín anatómico con gel para máxima comodidad.',
      stock: 20,
      sku: 'SADDLE-001',
      featured: false,
    },
    {
      name: 'Kit Herramientas Básicas',
      price: 12000,
      category: 'Servicios',
      image: '/images/products/herramientas.jpg',
      description: 'Kit esencial de herramientas para mantenimiento básico.',
      stock: 35,
      sku: 'TOOL-001',
      featured: false,
    },
  ]

  for (const product of products) {
    await prisma.product.upsert({
      where: { sku: product.sku! },
      update: product,
      create: product,
    })
  }
  console.log('Products seeded successfully')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
