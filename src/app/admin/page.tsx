import { prisma } from '@/lib/prisma'

export default async function AdminDashboard() {
  const [totalProducts, totalOrders, totalUsers, recentOrders] = await Promise.all([
    prisma.product.count({ where: { isActive: true } }),
    prisma.order.count(),
    prisma.user.count(),
    prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: { items: true },
    }),
  ])

  const totalRevenue = await prisma.order.aggregate({
    where: { status: 'PAID' },
    _sum: { total: true },
  })

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        Dashboard
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-sm text-gray-600">Total Productos</p>
          <p className="text-3xl font-bold text-gray-900">{totalProducts}</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-sm text-gray-600">Total Pedidos</p>
          <p className="text-3xl font-bold text-gray-900">{totalOrders}</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-sm text-gray-600">Total Usuarios</p>
          <p className="text-3xl font-bold text-gray-900">{totalUsers}</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-sm text-gray-600">Ingresos (Pagados)</p>
          <p className="text-3xl font-bold text-gray-900">
            ${totalRevenue._sum.total?.toLocaleString() || 0}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Pedidos Recientes
        </h2>
        <div className="space-y-4">
          {recentOrders.map((order) => (
            <div
              key={order.id}
              className="flex justify-between items-center border-b pb-4"
            >
              <div>
                <p className="font-medium text-gray-900">
                  #{order.id.slice(-8)}
                </p>
                <p className="text-sm text-gray-600">
                  {order.customerName}
                </p>
              </div>
              <div className="text-right">
                <p className="font-medium">${order.total.toLocaleString()}</p>
                <span
                  className={`inline-flex text-xs px-2 py-1 rounded-full ${
                    order.status === 'PAID'
                      ? 'bg-green-100 text-green-800'
                      : order.status === 'PENDING'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {order.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
