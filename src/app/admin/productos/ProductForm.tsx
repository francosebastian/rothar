'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ImageUpload } from '@/components/ImageUpload'

export function ProductForm({ product, onCancel }: { product?: any, onCancel?: () => void }) {
  const router = useRouter()
  const [formData, setFormData] = useState({
    id: product?.id || '',
    name: product?.name || '',
    slug: product?.slug || '',
    price: product?.price || 0,
    category: product?.category || '',
    image: product?.image || '',
    description: product?.description || '',
    stock: product?.stock || 0,
    sku: product?.sku || '',
    isActive: product?.isActive ?? true,
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

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

    console.log('Saving product with image URL:', formData.image)

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
        if (onCancel) {
          onCancel()
        } else {
          router.push('/admin/productos')
          router.refresh()
        }
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
    <div className="bg-[#E6DAB9] p-6 rounded-lg shadow">
      <h2 className="text-xl font-display tracking-wider text-[#084C4C] mb-4">
        {product ? 'EDITAR PRODUCTO' : 'NUEVO PRODUCTO'}
      </h2>

      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-[#084C4C]">
              NOMBRE
            </label>
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
            <label className="block text-sm font-medium text-[#084C4C]">
              SLUG (URL AMIGABLE)
            </label>
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
          <label className="block text-sm font-medium text-[#084C4C]">
            SKU
          </label>
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
            <label className="block text-sm font-medium text-[#084C4C]">
              PRECIO
            </label>
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
            <label className="block text-sm font-medium text-[#084C4C]">
              STOCK
            </label>
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
          <label className="block text-sm font-medium text-[#084C4C]">
            CATEGORÍA
          </label>
          <select
            name="category"
            required
            value={formData.category}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-[#084C4C]/30 rounded-md shadow-sm focus:outline-none focus:ring-[#084C4C] focus:border-[#084C4C] sm:text-sm bg-white"
          >
            <option value="">Seleccionar...</option>
            <option value="Transmisión">Transmisión</option>
            <option value="Frenos">Frenos</option>
            <option value="Ruedas">Ruedas</option>
            <option value="Dirección">Dirección</option>
            <option value="Sillín">Sillín</option>
            <option value="Servicios">Servicios</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-[#084C4C]">
            IMAGEN
          </label>
          <ImageUpload
            value={formData.image}
            onChange={(url) => setFormData({ ...formData, image: url })}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[#084C4C]">
            DESCRIPCIÓN
          </label>
          <textarea
            name="description"
            required
            rows={3}
            value={formData.description}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-[#084C4C]/30 rounded-md shadow-sm focus:outline-none focus:ring-[#084C4C] focus:border-[#084C4C] sm:text-sm bg-white"
          />
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            name="isActive"
            checked={formData.isActive}
            onChange={handleChange}
            className="h-4 w-4 text-[#084C4C] focus:ring-[#084C4C] border-[#084C4C]/30 rounded"
          />
          <label className="ml-2 block text-sm text-[#084C4C]">
            Producto activo
          </label>
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-display tracking-wider text-[#E6DAB9] bg-[#084C4C] hover:bg-[#063d3d] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#084C4C] disabled:opacity-50"
          >
            {loading ? 'GUARDANDO...' : 'GUARDAR PRODUCTO'}
          </button>
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 py-2 px-4 border border-[#084C4C] rounded-md shadow-sm text-sm font-display tracking-wider text-[#084C4C] bg-[#E6DAB9] hover:bg-[#d4c89a] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#084C4C]"
            >
              CANCELAR
            </button>
          )}
        </div>
      </form>
    </div>
  )
}
