import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { sendOrderConfirmationEmail, sendAdminOrderNotification } from '@/lib/email'

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    const body = await request.json()
    const { customerName, customerEmail, customerPhone, shippingAddress, items, total } = body

    if (!customerName || !customerEmail || !items || !total) {
      return NextResponse.json(
        { error: 'Faltan datos requeridos' },
        { status: 400 }
      )
    }

  // Verify user if logged in
  let userId: string | undefined = undefined
  if (session?.user?.email) {
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    })
    if (user) {
      userId = user.id
    }
  }

  // Validate that all products exist
  const productIds = items.map((item: any) => item.id)
  const existingProducts = await prisma.product.findMany({
    where: { id: { in: productIds } },
    select: { id: true, stock: true, name: true }
  })

  const existingProductIds = new Set(existingProducts.map((p: { id: string }) => p.id))
  const invalidItems = items.filter((item: any) => !existingProductIds.has(item.id))
  
  if (invalidItems.length > 0) {
    return NextResponse.json(
      { error: `Productos no encontrados: ${invalidItems.map((i: any) => i.id).join(', ')}. Por favor, limpia tu carrito y vuelve a agregar productos.` },
      { status: 400 }
    )
  }

  // Check stock availability
  for (const item of items) {
    const product = existingProducts.find(p => p.id === item.id)
    if (product && product.stock < item.cantidad) {
      return NextResponse.json(
        { error: `Stock insuficiente para ${product.name}. Stock disponible: ${product.stock}` },
        { status: 400 }
      )
    }
  }

  // Create order in database
    const order = await prisma.order.create({
      data: {
        userId,
        customerName,
        customerEmail,
        customerPhone: customerPhone || '',
        shippingAddress: shippingAddress || {},
        total: parseFloat(total),
        status: 'PENDING',
        items: {
          create: items.map((item: any) => ({
            productId: item.id,
            quantity: item.cantidad,
            price: item.precio,
          })),
        },
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    })

    // Update product stock
    for (const item of items) {
      await prisma.product.update({
        where: { id: item.id },
        data: {
          stock: {
            decrement: item.cantidad,
          },
        },
      })
    }

    // Send confirmation email to customer (don't fail order if email fails)
    try {
      const emailData = {
        orderId: order.id,
        customerName: order.customerName,
        customerEmail: order.customerEmail,
        items: order.items.map((item) => ({
          name: item.product.name,
          quantity: item.quantity,
          price: Number(item.price),
        })),
        total: Number(order.total),
        shippingAddress: order.shippingAddress,
      }

      await sendOrderConfirmationEmail(emailData)
      await sendAdminOrderNotification(emailData)
    } catch (emailError) {
      console.error('Error sending emails (order still created):', emailError)
    }

    return NextResponse.json({
      success: true,
      orderId: order.id,
      message: 'Pedido creado exitosamente',
    })
  } catch (error) {
    console.error('Error creating order:', error)
    return NextResponse.json(
      { error: 'Error al procesar el pedido' },
      { status: 500 }
    )
  }
}
