'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ImageUpload } from '@/components/ImageUpload'
import type { Product } from '@/generated/prisma'

type SerializedProduct = Omit<Product, 'price'> & { price: number }

interface Category {
  id: string
  name: string
  slug: string
}

export function ProductForm({ product, onClose }: { product?: SerializedProduct, onClose?: () => void }) {
  const router = useRouter()
  const [categories, setCategories] = useState<Category[]>([])
  const [formData, setFormData] = useState({
    id: product?.id || '',
    name: product?.name || '',
    slug: product?.slug || '',
    price: product?.price ? Number(product.price) : 0,
    categoryId: product?.categoryId || '',
    image: product?.image || '',
    description: product?.description || '',
    stock: product?.stock || 0,
    sku: product?.sku || '',
    isActive: product?.isActive ?? true,
    featured: product?.featured ?? false,
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch('/api/categories')
      .then((res) => res.json())
      .then(setCategories)
      .catch(() => setError('Error al cargar categorías'))
  }, [])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const value =
      e.target.type === 'checkbox'
        ? (e.target as HTMLInputElement).checked
        : e.target.type === 'number'
        ? parseFloat(e.target.value)
        : e.target.value

    setFormData({
      ...formData,
      [e.target.name]: value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const url = formData.id
        ? `/api/admin/products/${formData.id}`
        : '/api/admin/products'

      const res = await fetch(url, {
        method: formData.id ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (res.ok) {
        if (onClose) {
          onClose()
        } else {
          router.push('/admin/productos')
        }
        router.refresh()
      } else {
        const data = await res.json()
        setError(data.error || 'Error al guardar producto')
      }
    } catch {
      setError('Error de conexión')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onClose}>
      <div className="bg-[#E6DAB9] p-6 rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-display tracking-wider text-[#084C4C]">
            {product ? 'EDITAR PRODUCTO' : 'NUEVO PRODUCTO'}
          </h2>
          <button onClick={onClose} className="text-[#084C4C] hover:text-[#063d3d] text-2xl">&times;</button>
        </div>

        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#084C4C]">NOMBRE</label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-[#084C4C]/30 rounded-md shadow-sm focus:outline-none focus:ring-[#084C4C] focus:border-[#084C4C] sm:text-sm bg-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#084C4C]">SLUG</label>
              <input
                type="text"
                name="slug"
                required
                value={formData.slug}
                onChange={handleChange}
                placeholder="ej: cadena-shimano-cn-hg40"
                className="mt-1 block w-full px-3 py-2 border border-[#084C4C]/30 rounded-md shadow-sm focus:outline-none focus:ring-[#084C4C] focus:border-[#084C4C] sm:text-sm bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#084C4C]">SKU</label>
            <input
              type="text"
              name="sku"
              value={formData.sku}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-[#084C4C]/30 rounded-md shadow-sm focus:outline-none focus:ring-[#084C4C] focus:border-[#084C4C] sm:text-sm bg-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#084C4C]">PRECIO</label>
              <input
                type="number"
                name="price"
                required
                min="0"
                step="0.01"
                value={formData.price}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-[#084C4C]/30 rounded-md shadow-sm focus:outline-none focus:ring-[#084C4C] focus:border-[#084C4C] sm:text-sm bg-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#084C4C]">STOCK</label>
              <input
                type="number"
                name="stock"
                required
                min="0"
                value={formData.stock}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-[#084C4C]/30 rounded-md shadow-sm focus:outline-none focus:ring-[#084C4C] focus:border-[#084C4C] sm:text-sm bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#084C4C]">CATEGORÍA</label>
            <select
              name="categoryId"
              required
              value={formData.categoryId}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-[#084C4C]/30 rounded-md shadow-sm focus:outline-none focus:ring-[#084C4C] focus:border-[#084C4C] sm:text-sm bg-white"
            >
              <option value="">Seleccionar...</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#084C4C]">IMAGEN</label>
            <ImageUpload
              value={formData.image}
              onChange={(url) => setFormData({ ...formData, image: url })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#084C4C]">DESCRIPCIÓN</label>
            <textarea
              name="description"
              required
              rows={3}
              value={formData.description}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-[#084C4C]/30 rounded-md shadow-sm focus:outline-none focus:ring-[#084C4C] focus:border-[#084C4C] sm:text-sm bg-white"
            />
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center">
              <input
                type="checkbox"
                name="isActive"
                checked={formData.isActive}
                onChange={handleChange}
                className="h-4 w-4 text-[#084C4C] focus:ring-[#084C4C] border-[#084C4C]/30 rounded"
              />
              <label className="ml-2 block text-sm text-[#084C4C]">Producto activo</label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                name="featured"
                checked={formData.featured}
                onChange={handleChange}
                className="h-4 w-4 text-[#084C4C] focus:ring-[#084C4C] border-[#084C4C]/30 rounded"
              />
              <label className="ml-2 block text-sm text-[#084C4C]">Destacado</label>
            </div>
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-display tracking-wider text-[#E6DAB9] bg-[#084C4C] hover:bg-[#063d3d] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#084C4C] disabled:opacity-50"
            >
              {loading ? 'GUARDANDO...' : 'GUARDAR PRODUCTO'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 px-4 border border-[#084C4C] rounded-md shadow-sm text-sm font-display tracking-wider text-[#084C4C] bg-[#E6DAB9] hover:bg-[#d4c89a] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#084C4C]"
            >
              CANCELAR
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
