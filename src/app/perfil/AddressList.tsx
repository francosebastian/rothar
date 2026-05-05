'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { EditAddressForm } from './EditAddressForm'

export function AddressList({ addresses }: { addresses: any[] }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [editing, setEditing] = useState(false)

  const address = addresses[0]

  const handleDelete = async () => {
    if (!confirm('¿Eliminar esta dirección?')) return

    setLoading(true)
    try {
      const res = await fetch(`/api/addresses/${address.id}`, {
        method: 'DELETE',
      })

      if (res.ok) {
        router.refresh()
      }
    } catch (error) {
      console.error('Error deleting address:', error)
    } finally {
      setLoading(false)
    }
  }

  if (!address) {
    return null
  }

  return (
    <div className="border border-[#E6DAB9]/20 rounded-lg p-4 relative">
      {editing ? (
        <EditAddressForm 
          address={address} 
          onCancel={() => setEditing(false)} 
        />
      ) : (
        <>
          <p className="text-sm text-[#E6DAB9] font-medium">
            {address.street}
          </p>
          <p className="text-sm text-[#E6DAB9]/70">
            {address.city}, {address.state}
          </p>
          {address.zipCode && (
            <p className="text-sm text-[#E6DAB9]/70">
              CP: {address.zipCode}
            </p>
          )}
          
          <div className="flex gap-3 mt-4">
            <button
              onClick={() => setEditing(true)}
              className="text-sm text-[#E6DAB9] hover:text-[#E6DAB9]/70"
            >
              Editar
            </button>
            <button
              onClick={handleDelete}
              disabled={loading}
              className="text-sm text-red-400 hover:text-red-300 disabled:opacity-50"
            >
              {loading ? 'Eliminando...' : 'Eliminar'}
            </button>
          </div>
        </>
      )}
    </div>
  )
}
