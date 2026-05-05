'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

const STATUS_OPTIONS = [
  { value: 'PENDING', label: 'Pendiente' },
  { value: 'PAID', label: 'Pagado' },
  { value: 'SHIPPED', label: 'Enviado' },
  { value: 'DELIVERED', label: 'Entregado' },
  { value: 'CANCELLED', label: 'Cancelado' },
]

export function OrderStatusUpdate({ orderId, currentStatus }: { orderId: string; currentStatus: string }) {
  const [status, setStatus] = useState(currentStatus)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleUpdate = async () => {
    if (status === currentStatus) return
    
    setLoading(true)
    try {
      const res = await fetch(`/api/pedidos/${orderId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })
      
      if (res.ok) {
        router.refresh()
      } else {
        alert('Error al actualizar el estado')
      }
    } catch (error) {
      alert('Error al actualizar el estado')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center gap-2">
      <select
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        className="text-sm border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
        disabled={loading}
      >
        {STATUS_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <button
        onClick={handleUpdate}
        disabled={loading || status === currentStatus}
        className="text-sm bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? '...' : 'Actualizar'}
      </button>
    </div>
  )
}
