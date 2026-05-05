import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { AddAddressForm } from './AddAddressForm'
import { AddressList } from './AddressList'
import { OrderHistory } from './OrderHistory'

export default async function PerfilPage() {
  const session = await auth()

  if (!session) {
    redirect('/login')
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user?.email as string },
    include: {
      shippingAddresses: true,
      orders: {
        orderBy: { createdAt: 'desc' },
        take: 10,
        include: {
          items: {
            include: {
              product: true,
            },
          },
        },
      },
    },
  })

  if (!user) {
    redirect('/login')
  }

  return (
    <main className="flex min-h-screen flex-col">
      <Navbar />

      <section className="flex-1 py-20 bg-[#E6DAB9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-display text-[#084C4C] tracking-wider mb-8">
            MI PERFIL
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1">
              <div className="bg-[#084C4C] shadow-lg p-6">
                <h2 className="text-2xl font-display text-[#E6DAB9] tracking-wider mb-6">
                  INFORMACIÓN PERSONAL
                </h2>
                <div className="space-y-3">
                  <p className="text-sm text-[#E6DAB9]/90">
                    <span className="font-medium text-[#E6DAB9]">Nombre:</span> {user.name}
                  </p>
                  <p className="text-sm text-[#E6DAB9]/90">
                    <span className="font-medium text-[#E6DAB9]">Email:</span> {user.email}
                  </p>
                  {user.phone && (
                    <p className="text-sm text-[#E6DAB9]/90">
                      <span className="font-medium text-[#E6DAB9]">Teléfono:</span> {user.phone}
                    </p>
                  )}
                  <p className="text-sm text-[#E6DAB9]/90">
                    <span className="font-medium text-[#E6DAB9]">Rol:</span>{' '}
                    {user.role === 'ADMIN' ? 'Administrador' : 'Cliente'}
                  </p>
                </div>
              </div>
            </div>

          <div className="md:col-span-2 space-y-6">
            <div className="bg-[#084C4C] shadow-lg p-6">
              <h2 className="text-2xl font-display text-[#E6DAB9] tracking-wider mb-6">
                MI DIRECCIÓN DE ENVÍO
              </h2>
              {user.shippingAddresses.length > 0 ? (
                <AddressList addresses={user.shippingAddresses.slice(0, 1)} />
              ) : (
                <AddAddressForm userId={user.id} />
              )}
            </div>

              <div className="bg-[#084C4C] shadow-lg p-6">
                <h2 className="text-2xl font-display text-[#E6DAB9] tracking-wider mb-6">
                  HISTORIAL DE PEDIDOS
                </h2>
                <OrderHistory orders={user.orders} />
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
