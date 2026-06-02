'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ProductForm } from './ProductForm'
import type { Product } from '@/generated/prisma'

type SerializedProduct = Omit<Product, 'price'> & { price: number }

export function ProductList({ products }: { products: SerializedProduct[] }) {
  const router = useRouter()
  const [loading, setLoading] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState<SerializedProduct | null>(null)

  const openCreate = () => {
    setEditingProduct(null)
    setShowForm(true)
  }

  const openEdit = (product: SerializedProduct) => {
    setEditingProduct(product)
    setShowForm(true)
  }

  const closeForm = () => {
    setShowForm(false)
    setEditingProduct(null)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('¿Eliminar este producto?')) return
    setLoading(id)
    try {
      const res = await fetch(`/api/admin/products/${id}`, { method: 'DELETE' })
      if (res.ok) router.refresh()
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
      if (res.ok) router.refresh()
    } catch (error) {
      console.error('Error updating product:', error)
    } finally {
      setLoading(null)
    }
  }

  return (
    <>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Gestionar Productos</h1>
        <button
          onClick={openCreate}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          + Agregar Producto
        </button>
      </div>

      {showForm && (
        <ProductForm product={editingProduct ?? undefined} onClose={closeForm} />
      )}

      {products.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-6 text-center text-gray-500">
          No hay productos. Agrega uno nuevo.
        </div>
      ) : (
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Imagen</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nombre</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Categoría</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Precio</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stock</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {products.map((product) => (
                <tr key={product.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {product.image && <img src={product.image} alt={product.name} className="h-10 w-10 rounded object-cover" />}
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{product.name}</div>
                    {product.sku && <div className="text-sm text-gray-500">{product.sku}</div>}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">{(product as any).category?.name || product.categoryId}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">${Number(product.price).toLocaleString()}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{product.stock}</td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => toggleActive(product.id, product.isActive)}
                      disabled={loading === product.id}
                      className={`px-2 py-1 text-xs rounded-full ${
                        product.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      } disabled:opacity-50`}
                    >
                      {loading === product.id ? '...' : product.isActive ? 'ACTIVO' : 'INACTIVO'}
                    </button>
                  </td>
                  <td className="px-6 py-4 text-right text-sm space-x-2">
                    <button onClick={() => openEdit(product)} className="text-indigo-600 hover:text-indigo-900">Editar</button>
                    <button onClick={() => handleDelete(product.id)} disabled={loading === product.id} className="text-red-600 hover:text-red-900 disabled:opacity-50">
                      {loading === product.id ? 'Eliminando...' : 'Eliminar'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  )
}
