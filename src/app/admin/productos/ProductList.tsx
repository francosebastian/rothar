'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ProductForm } from './ProductForm'
import type { Product } from '@/generated/prisma'

export function ProductList({ products }: { products: Product[] }) {
  const router = useRouter()
  const [loading, setLoading] = useState<string | null>(null)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)

  const handleDelete = async (id: string) => {
    if (!confirm('¿Eliminar este producto?')) return

    setLoading(id)
    try {
      const res = await fetch(`/api/admin/products/${id}`, {
        method: 'DELETE',
      })

      if (res.ok) {
        router.refresh()
      }
    } catch (error) {
      console.error('Error deleting product:', error)
    } finally {
      setLoading(null)
    }
  }

  const toggleActive = async (id: string, currentState: boolean) => {
    setLoading(id)
    try {
      const res = await fetch(`/api/admin/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !currentState }),
      })

      if (res.ok) {
        router.refresh()
      }
    } catch (error) {
      console.error('Error updating product:', error)
    } finally {
      setLoading(null)
    }
  }

  if (products.length === 0) {
    return (
      <div className="bg-[#E6DAB9] rounded-lg shadow p-6 text-center text-[#084C4C]">
        No hay productos. Agrega uno nuevo.
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {products.map((product) => (
        <div key={product.id} className="bg-[#E6DAB9] rounded-lg shadow p-6">
          {editingProduct?.id === product.id ? (
            <ProductForm product={editingProduct} onCancel={() => setEditingProduct(null)} />
          ) : (
            <>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="h-12 w-12 rounded object-cover"
                  />
                  <div>
                    <h3 className="font-display tracking-wider text-[#084C4C]">{product.name}</h3>
                    <p className="text-sm text-[#084C4C]/70">{product.sku}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleActive(product.id, product.isActive)}
                    disabled={loading === product.id}
                    className={`px-2 py-1 text-xs rounded-full font-display tracking-wider ${
                      product.isActive 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    } disabled:opacity-50`}
                  >
                    {loading === product.id ? '...' : product.isActive ? 'ACTIVO' : 'INACTIVO'}
                  </button>
                  <button
                    onClick={() => setEditingProduct(product)}
                    className="text-[#084C4C] hover:text-[#063d3d] text-sm font-display tracking-wider"
                  >
                    EDITAR
                  </button>
                  <button
                    onClick={() => handleDelete(product.id)}
                    disabled={loading === product.id}
                    className="text-red-600 hover:text-red-900 text-sm font-display tracking-wider disabled:opacity-50"
                  >
                    {loading === product.id ? 'ELIMINANDO...' : 'ELIMINAR'}
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 text-sm text-[#084C4C]/70">
                <div>
                  <span className="font-display tracking-wider">CATEGORÍA:</span> {product.category}
                </div>
                <div>
                  <span className="font-display tracking-wider">PRECIO:</span> ${product.price.toLocaleString()}
                </div>
                <div>
                  <span className="font-display tracking-wider">STOCK:</span> {product.stock}
                </div>
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  )
}
