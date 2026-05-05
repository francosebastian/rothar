'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export function AddAddressForm({ userId }: { userId: string }) {
  const router = useRouter()
  const [formData, setFormData] = useState({
    street: '',
    city: '',
    state: '',
    zipCode: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

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
    setSuccess(false)

    try {
      const res = await fetch('/api/addresses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, userId }),
      })

      if (res.ok) {
        setSuccess(true)
        setFormData({ street: '', city: '', state: '', zipCode: '' })
        router.refresh()
      } else {
        const data = await res.json()
        setError(data.error || 'Error al guardar dirección')
      }
    } catch {
      setError('Error de conexión')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mt-6 border-t border-[#E6DAB9]/20 pt-6">
      <h3 className="text-xl font-display text-[#E6DAB9] tracking-wider mb-4">
        AGREGAR NUEVA DIRECCIÓN
      </h3>

      {success && (
        <div className="mb-4 bg-green-900/30 border border-green-700/50 text-green-300 px-4 py-3 rounded">
          Dirección guardada exitosamente
        </div>
      )}

      {error && (
        <div className="mb-4 bg-red-900/30 border border-red-700/50 text-red-300 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-[#E6DAB9]">
            Calle y número
          </label>
          <input
            type="text"
            name="street"
            required
            value={formData.street}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 bg-[#E6DAB9] text-[#084C4C] border-0 focus:outline-none"
            placeholder="Av. Principal 123"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-[#E6DAB9]">
              Ciudad
            </label>
            <input
              type="text"
              name="city"
              required
              value={formData.city}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 bg-[#E6DAB9] text-[#084C4C] border-0 focus:outline-none"
              placeholder="Ciudad"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#E6DAB9]">
              Provincia
            </label>
            <input
              type="text"
              name="state"
              value={formData.state}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 bg-[#E6DAB9] text-[#084C4C] border-0 focus:outline-none"
              placeholder="Provincia"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-[#E6DAB9]">
            Código Postal
          </label>
          <input
            type="text"
            name="zipCode"
            value={formData.zipCode}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 bg-[#E6DAB9] text-[#084C4C] border-0 focus:outline-none"
            placeholder="Código postal"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#E6DAB9] text-[#084C4C] py-3 font-display tracking-wider hover:bg-[#d4c9a5] transition-colors disabled:opacity-50"
        >
          {loading ? 'GUARDANDO...' : 'GUARDAR DIRECCIÓN'}
        </button>
      </form>
    </div>
  )
}
