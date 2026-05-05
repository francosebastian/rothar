export function OrderHistory({ orders }: { orders: any[] }) {
  if (orders.length === 0) {
    return (
      <p className="text-[#E6DAB9]/70 text-sm">
        No tienes pedidos realizados.
      </p>
    )
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <div
          key={order.id}
          className="border border-[#E6DAB9]/20 rounded-lg p-4"
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-[#E6DAB9]">
                Pedido #{order.id.slice(-8)}
              </p>
              <p className="text-sm text-[#E6DAB9]/70">
                {new Date(order.createdAt).toLocaleDateString('es-ES', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-[#E6DAB9]">
                ${Number(order.total).toLocaleString('es-CL')}
              </p>
              <span
                className={`inline-flex text-xs px-2 py-1 rounded-full ${
                  order.status === 'PAID'
                    ? 'bg-green-900/30 text-green-300'
                    : order.status === 'PENDING'
                    ? 'bg-yellow-900/30 text-yellow-300'
                    : 'bg-gray-800/30 text-gray-300'
                }`}
              >
                {order.status}
              </span>
            </div>
          </div>
          <div className="mt-2">
            <p className="text-xs text-[#E6DAB9]/70">
              {order.items?.length || 0} producto(s)
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}
