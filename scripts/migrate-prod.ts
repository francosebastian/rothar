import { PrismaClient } from '../src/generated/prisma'

const DATABASE_URL = process.env.DATABASE_URL!

let prisma: PrismaClient

if (DATABASE_URL.includes('neon.tech')) {
  const { PrismaNeon } = require('@prisma/adapter-neon')
  const adapter = new PrismaNeon({ connectionString: DATABASE_URL })
  prisma = new PrismaClient({ adapter })
} else {
  const { PrismaPg } = require('@prisma/adapter-pg')
  const adapter = new PrismaPg({ connectionString: DATABASE_URL })
  prisma = new PrismaClient({ adapter })
}

async function main() {
  console.log('Conectando...')

  const hasCategoryTable = await prisma.$queryRawUnsafe<any[]>(
    `SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'Category')`
  )
  if (hasCategoryTable[0]?.exists) {
    console.log('Migración ya aplicada')
    return
  }

  const existingCategories = await prisma.$queryRawUnsafe<{ category: string }[]>(
    `SELECT DISTINCT "category" FROM "Product" WHERE "category" IS NOT NULL`
  )
  console.log(`Categorías existentes: ${existingCategories.map(r => r.category).join(', ') || 'ninguna'}`)

  // Create Category table
  await prisma.$executeRawUnsafe(`
    CREATE TABLE "Category" (
      "id" TEXT NOT NULL,
      "name" TEXT NOT NULL,
      "slug" TEXT NOT NULL,
      "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" TIMESTAMP(3) NOT NULL,
      CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
    )
  `)
  await prisma.$executeRawUnsafe(`CREATE UNIQUE INDEX "Category_name_key" ON "Category"("name")`)
  await prisma.$executeRawUnsafe(`CREATE UNIQUE INDEX "Category_slug_key" ON "Category"("slug")`)
  console.log('Tabla Category creada')

  // Create Faq table
  await prisma.$executeRawUnsafe(`
    CREATE TABLE "Faq" (
      "id" TEXT NOT NULL,
      "question" TEXT NOT NULL,
      "answer" TEXT NOT NULL,
      "order" INTEGER NOT NULL DEFAULT 0,
      "isActive" BOOLEAN NOT NULL DEFAULT true,
      "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" TIMESTAMP(3) NOT NULL,
      CONSTRAINT "Faq_pkey" PRIMARY KEY ("id")
    )
  `)
  console.log('Tabla Faq creada')

  // Add categoryId column as nullable
  await prisma.$executeRawUnsafe(`ALTER TABLE "Product" ADD COLUMN "categoryId" TEXT`)
  console.log('Columna categoryId agregada')

  // Insert default categories + categories from existing products using gen_random_uuid()
  await prisma.$executeRawUnsafe(`
    INSERT INTO "Category" ("id", "name", "slug", "updatedAt")
    SELECT gen_random_uuid()::text, 'Transmisión', 'transmision', NOW()
    WHERE NOT EXISTS (SELECT 1 FROM "Category" WHERE slug = 'transmision')
  `)
  await prisma.$executeRawUnsafe(`
    INSERT INTO "Category" ("id", "name", "slug", "updatedAt")
    SELECT gen_random_uuid()::text, 'Frenos', 'frenos', NOW()
    WHERE NOT EXISTS (SELECT 1 FROM "Category" WHERE slug = 'frenos')
  `)
  await prisma.$executeRawUnsafe(`
    INSERT INTO "Category" ("id", "name", "slug", "updatedAt")
    SELECT gen_random_uuid()::text, 'Ruedas', 'ruedas', NOW()
    WHERE NOT EXISTS (SELECT 1 FROM "Category" WHERE slug = 'ruedas')
  `)
  await prisma.$executeRawUnsafe(`
    INSERT INTO "Category" ("id", "name", "slug", "updatedAt")
    SELECT gen_random_uuid()::text, 'Dirección', 'direccion', NOW()
    WHERE NOT EXISTS (SELECT 1 FROM "Category" WHERE slug = 'direccion')
  `)
  await prisma.$executeRawUnsafe(`
    INSERT INTO "Category" ("id", "name", "slug", "updatedAt")
    SELECT gen_random_uuid()::text, 'Sillín', 'sillin', NOW()
    WHERE NOT EXISTS (SELECT 1 FROM "Category" WHERE slug = 'sillin')
  `)
  await prisma.$executeRawUnsafe(`
    INSERT INTO "Category" ("id", "name", "slug", "updatedAt")
    SELECT gen_random_uuid()::text, 'Servicios', 'servicios', NOW()
    WHERE NOT EXISTS (SELECT 1 FROM "Category" WHERE slug = 'servicios')
  `)
  console.log('Categorías default insertadas')

  // Map existing product categories — create any missing ones (skip if name already exists)
  for (const row of existingCategories) {
    const name = row.category
    const slug = name.toLowerCase().replace(/[^a-z0-9áéíóúñ]+/g, '-').replace(/^-|-$/g, '')
    await prisma.$executeRawUnsafe(`
      INSERT INTO "Category" ("id", "name", "slug", "updatedAt")
      SELECT gen_random_uuid()::text, $1, $2, NOW()
      WHERE NOT EXISTS (SELECT 1 FROM "Category" WHERE "name" = $1)
    `, name, slug)
  }

  // Update products with categoryId
  const allCats = await prisma.$queryRawUnsafe<{ name: string; id: string }[]>(
    `SELECT "name", "id" FROM "Category"`
  )
  for (const cat of allCats) {
    await prisma.$executeRawUnsafe(
      `UPDATE "Product" SET "categoryId" = $1 WHERE "category" = $2 AND "categoryId" IS NULL`,
      cat.id, cat.name
    )
  }
  console.log('Productos actualizados')

  // Set NOT NULL, add FK, drop old column
  await prisma.$executeRawUnsafe(`ALTER TABLE "Product" ALTER COLUMN "categoryId" SET NOT NULL`)
  await prisma.$executeRawUnsafe(
    `ALTER TABLE "Product" ADD CONSTRAINT "Product_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE`
  )
  await prisma.$executeRawUnsafe(`ALTER TABLE "Product" DROP COLUMN "category"`)
  console.log('Columna category eliminada, FK creada')

  console.log('Migración completada')
}

main()
  .catch((e) => { console.error('Error:', e); process.exit(1) })
  .finally(() => prisma.$disconnect())
