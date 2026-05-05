import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { NextResponse } from 'next/server'

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ orderId: string }> }
) {
  try {
    const session = await auth()
    
    if (!session?.user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }
    
    const { orderId } = await params
    const body = await request.json()
    const { status } = body
    
    if (!status) {
      return NextResponse.json({ error: 'Status requerido' }, { status: 400 })
    }
    
    const validStatuses = ['PENDING', 'PAID', 'SHIPPED', 'DELIVERED', 'CANCELLED']
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: 'Status inválido' }, { status: 400 })
    }
    
    const order = await prisma.order.findUnique({
      where: { id: orderId },
    })
    
    if (!order) {
      return NextResponse.json({ error: 'Pedido no encontrado' }, { status: 404 })
    }
    
    // Solo el dueño del pedido o un admin pueden actualizar
    if (order.userId !== session.user.id && session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
    }
    
    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: { status },
    })
    
    return NextResponse.json(updatedOrder)
  } catch (error) {
    console.error('Error updating order status:', error)
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}
