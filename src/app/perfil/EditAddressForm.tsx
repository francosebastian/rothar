'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export function EditAddressForm({ 
  address, 
  onCancel 
}: { 
  address: any
  onCancel: () => void 
}) {
  const router = useRouter()
  const [formData, setFormData] = useState({
    street: address.street || '',
    city: address.city || '',
    state: address.state || '',
    zipCode: address.zipCode || '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await fetch(`/api/addresses/${address.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (res.ok) {
        router.refresh()
        onCancel()
      } else {
        const data = await res.json()
        setError(data.error || 'Error al actualizar dirección')
      }
    } catch {
      setError('Error de conexión')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mt-4 border border-[#E6DAB9]/20 rounded-lg p-4 bg-[#063d3d]">
      <h4 className="text-sm font-medium text-[#E6DAB9] mb-3">EDITAR DIRECCIÓN</h4>

      {error && (
        <div className="mb-3 bg-red-900/30 border border-red-700/50 text-red-300 px-3 py-2 rounded text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="block text-xs font-medium text-[#E6DAB9]">Calle y número</label>
          <input
            type="text"
            name="street"
            required
            value={formData.street}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 bg-[#E6DAB9] text-[#084C4C] border-0 focus:outline-none text-sm"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-[#E6DAB9]">Ciudad</label>
            <input
              type="text"
              name="city"
              required
              value={formData.city}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 bg-[#E6DAB9] text-[#084C4C] border-0 focus:outline-none text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-[#E6DAB9]">Provincia</label>
            <input
              type="text"
              name="state"
              value={formData.state}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 bg-[#E6DAB9] text-[#084C4C] border-0 focus:outline-none text-sm"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-[#E6DAB9]">Código Postal</label>
          <input
            type="text"
            name="zipCode"
            value={formData.zipCode}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 bg-[#E6DAB9] text-[#084C4C] border-0 focus:outline-none text-sm"
          />
        </div>

        <div className="flex gap-2">
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-[#E6DAB9] text-[#084C4C] text-sm font-display tracking-wider hover:bg-[#d4c9a5] transition-colors disabled:opacity-50"
          >
            {loading ? 'GUARDANDO...' : 'GUARDAR'}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 bg-transparent border border-[#E6DAB9]/30 text-[#E6DAB9] text-sm font-display tracking-wider hover:bg-[#E6DAB9]/10 transition-colors"
          >
            CANCELAR
          </button>
        </div>
      </form>
    </div>
  )
}
