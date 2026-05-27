import { prisma } from '@/lib/prisma'
import { ProductList } from './ProductList'

type ProductType = Awaited<ReturnType<typeof prisma.product.findMany>>[number]

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    include: { category: true },
    orderBy: { createdAt: 'desc' },
  })

  const serializedProducts = products.map((p) => ({
    ...p,
    price: Number(p.price),
  }))

  return (
    <div>
      <ProductList products={serializedProducts} />
    </div>
  )
}
