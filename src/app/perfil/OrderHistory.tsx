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
          <div className="flex justify-between items-start mb-4">
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
          
          {/* Lista de productos */}
          <div className="space-y-2">
            {order.items?.map((item: any) => (
              <div
                key={item.id}
                className="flex justify-between items-center py-2 border-t border-[#E6DAB9]/10"
              >
                <div className="flex items-center gap-3">
                  {item.product?.image && (
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="h-10 w-10 rounded object-cover"
                    />
                  )}
                  <div>
                    <p className="text-sm text-[#E6DAB9]">
                      {item.product?.name || 'Producto no disponible'}
                    </p>
                    <p className="text-xs text-[#E6DAB9]/50">
                      Cantidad: {item.quantity}
                    </p>
                  </div>
                </div>
                <p className="text-sm text-[#E6DAB9]/70">
                  ${(Number(item.price) * item.quantity).toLocaleString('es-CL')}
                </p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
