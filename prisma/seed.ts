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
      slug: 'cadena-shimano-cn-hg40',
      price: 15000,
      category: 'Transmisión',
      image: 'https://goc9lmmt47.ucarecd.net/c7708d94-e01b-4fb1-8059-ecb97c89da8a/Cadena-Shimano.jpg',
      description: 'Cadena de alta calidad para transmisión de 6/7/8 velocidades.',
      stock: 50,
      sku: 'CHAIN-001',
      featured: true,
    },
    {
      name: 'Freno V-Brake Shimano BR-T4000',
      slug: 'freno-v-brake-shimano-br-t4000',
      price: 28000,
      category: 'Frenos',
      image: 'https://goc9lmmt47.ucarecd.net/c7708d94-e01b-4fb1-8059-ecb97c89da8a/Freno-Shimano.jpg',
      description: 'Freno V-Brake duradoro para frenado seguro en ciudad.',
      stock: 30,
      sku: 'BRAKE-001',
      featured: true,
    },
    {
      name: 'Cubierta Kenda Kwick Trax 700x32',
      slug: 'cubierta-kenda-kwick-trax-700x32',
      price: 22000,
      category: 'Ruedas',
      image: 'https://goc9lmmt47.ucarecd.net/c7708d94-e01b-4fb1-8059-ecb97c89da8a/Cubierta-Kenda.jpg',
      description: 'Cubierta multitrack para ciudad y caminos mixtos.',
      stock: 40,
      sku: 'TIRE-001',
      featured: true,
    },
    {
      name: 'Manubrio Rise Bar 31.8mm',
      slug: 'manubrio-rise-bar-31-8mm',
      price: 18000,
      category: 'Dirección',
      image: 'https://goc9lmmt47.ucarecd.net/c7708d94-e01b-4fb1-8059-ecb97c89da8a/Manubrio-Rise.jpg',
      description: 'Manubrio cómodo para posición erguida en ciudad.',
      stock: 25,
      sku: 'HANDLE-001',
      featured: false,
    },
    {
      name: 'Sillín Ergonómico Selle Royal',
      slug: 'sillin-ergonomico-selle-royal',
      price: 35000,
      category: 'Sillín',
      image: 'https://goc9lmmt47.ucarecd.net/c7708d94-e01b-4fb1-8059-ecb97c89da8a/Sillin-Selle.jpg',
      description: 'Sillín anatómico con gel para máxima comodidad.',
      stock: 20,
      sku: 'SADDLE-001',
      featured: false,
    },
    {
      name: 'Kit Herramientas Básicas',
      slug: 'kit-herramientas-basicas',
      price: 12000,
      category: 'Servicios',
      image: 'https://goc9lmmt47.ucarecd.net/c7708d94-e01b-4fb1-8059-ecb97c89da8a/Kit-Herramientas.jpg',
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
