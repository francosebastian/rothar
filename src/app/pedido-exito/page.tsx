import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Link from 'next/link'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'

export default async function OrderSuccessPage() {
  const session = await auth()

  // Get the last order for this user or session
  const order = await prisma.order.findFirst({
    orderBy: { createdAt: 'desc' },
    where: session?.user?.email
      ? {
          OR: [
            { customerEmail: session.user.email },
            { user: { email: session.user.email } },
          ],
        }
      : {},
    include: {
      items: {
        include: {
          product: true,
        },
      },
    },
  })

  if (!order) {
    redirect('/tienda')
  }

type OrderItemWithProduct = typeof order.items[number]

  return (
    <main className="flex min-h-screen flex-col">
      <Navbar />

      <section className="flex-1 flex items-center justify-center bg-[#E6DAB9] py-20 md:py-32">
        <div className="text-center max-w-2xl mx-auto px-4">
          <div className="mb-8">
            <svg
              className="w-24 h-24 text-green-600 mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h1 className="text-4xl md:text-5xl font-display text-[#084C4C] tracking-wider mb-4">
            ¡PEDIDO RECIBIDO!
          </h1>
          <p className="text-[#084C4C]/70 text-lg mb-8">
            Gracias por tu compra, {order.customerName}. Hemos recibido tu pedido
            #{order.id.slice(-8)} y nos pondremos en contacto contigo pronto para
            coordinar el envío.
          </p>

          <div className="bg-[#084C4C] p-6 mb-8 text-left">
            <h2 className="text-xl font-display text-[#E6DAB9] tracking-wider mb-4">
              RESUMEN DEL PEDIDO
            </h2>
              {order.items.map((item: OrderItemWithProduct) => (
                <div
                  key={item.id}
                  className="flex justify-between py-2 border-b border-[#E6DAB9]/20 last:border-0"
                >
                  <span className="text-[#E6DAB9]">
                    {item.product.name} x{item.quantity}
                  </span>
                  <span className="text-[#E6DAB9]">
                    ${(Number(item.price) * item.quantity).toLocaleString('es-CL')}
                  </span>
                </div>
              ))}
              <div className="flex justify-between mt-4 pt-4 border-t border-[#E6DAB9]/20">
                <span className="text-2xl font-display text-[#E6DAB9]">
                  TOTAL
                </span>
                <span className="text-2xl font-display text-[#E6DAB9]">
                  ${Number(order.total).toLocaleString('es-CL')}
                </span>
              </div>
          </div>

          <div className="bg-[#084C4C]/10 border border-[#084C4C]/20 p-4 mb-8 rounded">
              <p className="text-[#084C4C] mb-2">
                ¿Quieres recibir ofertas y descuentos exclusivos?
              </p>
              <Link
                href="/registro"
                className="bg-[#084C4C] text-[#E6DAB9] px-6 py-2 font-display tracking-wider hover:bg-[#063d3d] transition-colors inline-block"
              >
                REGISTRATE AQUÍ
              </Link>
            </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/tienda"
              className="bg-[#084C4C] text-[#E6DAB9] px-8 py-4 font-display text-lg tracking-wider hover:bg-[#063d3d] transition-colors inline-block"
            >
              SEGUIR COMPRANDO
            </Link>
            <Link
              href="/"
              className="bg-transparent border-2 border-[#084C4C] text-[#084C4C] px-8 py-4 font-display text-lg tracking-wider hover:bg-[#084C4C] hover:text-[#E6DAB9] transition-colors inline-block"
            >
              VOLVER AL INICIO
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
