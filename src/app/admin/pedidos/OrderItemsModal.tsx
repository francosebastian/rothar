'use client'

import { useState } from 'react'

interface OrderItem {
  id: string
  quantity: number
  price: number | string
  product: {
    name: string
    image: string | null
  } | null
}

interface OrderItemsModalProps {
  orderId: string
  items: OrderItem[]
  total: number | string
}

export function OrderItemsModal({ orderId, items, total }: OrderItemsModalProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="text-sm text-blue-600 hover:text-blue-800 font-medium"
      >
        Ver {items.length} producto{items.length !== 1 ? 's' : ''}
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-lg w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Productos del Pedido #{orderId.slice(-8)}
                </h3>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-3">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    {item.product?.image && (
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-12 h-12 object-cover rounded"
                      />
                    )}
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">
                        {item.product?.name || 'Producto eliminado'}
                      </p>
                      <p className="text-xs text-gray-500">
                        Cantidad: {item.quantity} × ${Number(item.price).toLocaleString()}
                      </p>
                    </div>
                    <div className="text-sm font-semibold text-gray-900">
                      ${(Number(item.price) * item.quantity).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex justify-between items-center">
                  <span className="text-base font-semibold text-gray-900">Total:</span>
                  <span className="text-lg font-bold text-gray-900">
                    ${Number(total).toLocaleString()}
                  </span>
                </div>
              </div>

              <button
                onClick={() => setIsOpen(false)}
                className="mt-6 w-full bg-gray-900 text-white py-2 px-4 rounded-lg hover:bg-gray-800 transition-colors"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
