import { prisma } from '@/lib/prisma'
import { UserRole } from '@/generated/prisma'

export default async function AdminUsersPage() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      _count: {
        select: { orders: true },
      },
    },
  })

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        Gestionar Usuarios
      </h1>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Usuario
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Rol
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Teléfono
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Pedidos
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Registro
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {user.name}
                  </div>
                  <div className="text-sm text-gray-500">
                    {user.email}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      user.role === 'ADMIN'
                        ? 'bg-purple-100 text-purple-800'
                        : 'bg-green-100 text-green-800'
                    }`}
                  >
                    {user.role === 'ADMIN' ? 'Admin' : 'Cliente'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {user.phone || '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {user._count.orders}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(user.createdAt).toLocaleDateString('es-ES')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {users.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            No hay usuarios.
          </div>
        )}
      </div>
    </div>
  )
}
