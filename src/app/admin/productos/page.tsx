import { prisma } from '@/lib/prisma'
import { ProductForm } from './ProductForm'
import { ProductList } from './ProductList'
import { ToggleButton } from '@/components/ToggleButton'

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: 'desc' },
  })

  // Convert Decimal to number for client components
  const serializedProducts = products.map(p => ({
    ...p,
    price: Number(p.price),
  }))

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Gestionar Productos
        </h1>
        <ToggleButton targetId="product-form" label="+ Agregar Producto" />
      </div>

      <div id="product-form" className="hidden mb-8">
        <ProductForm />
      </div>

      <ProductList products={serializedProducts} />
    </div>
  )
}
