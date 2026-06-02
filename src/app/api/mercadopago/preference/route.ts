import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

const MP_ACCESS_TOKEN = process.env.MERCADO_PAGO_ACCESS_TOKEN
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3001'

export async function POST(request: NextRequest) {
  if (!MP_ACCESS_TOKEN) {
    return NextResponse.json(
      { error: 'MercadoPago no configurado' },
      { status: 500 }
    )
  }

  try {
    const body = await request.json()
    const { items, datosCliente, shippingAddress } = body

    if (!items?.length || !datosCliente?.nombre || !datosCliente?.email) {
      return NextResponse.json(
        { error: 'Faltan datos requeridos' },
        { status: 400 }
      )
    }

    const productIds = items.map((i: any) => i.id)
    const products = await prisma.product.findMany({
      where: { id: { in: productIds }, isActive: true },
    })

    if (products.length !== productIds.length) {
      return NextResponse.json(
        { error: 'Productos no encontrados' },
        { status: 400 }
      )
    }

    const productMap = new Map(products.map(p => [p.id, p]))
    let serverTotal = 0
    for (const item of items) {
      const product = productMap.get(item.id)
      if (!product) continue
      if (product.stock < item.cantidad) {
        return NextResponse.json(
          { error: `Stock insuficiente para ${product.name}` },
          { status: 400 }
        )
      }
      serverTotal += Number(product.price) * item.cantidad
    }

    const order = await prisma.order.create({
      data: {
        customerName: datosCliente.nombre,
        customerEmail: datosCliente.email,
        customerPhone: datosCliente.telefono || '',
        shippingAddress: shippingAddress || {},
        total: serverTotal,
        status: 'PENDING',
        items: {
          create: items.map((item: any) => ({
            productId: item.id,
            quantity: item.cantidad,
            price: Number(productMap.get(item.id)!.price),
          })),
        },
      },
    })

    const preference = {
      items: items.map((item: any) => {
        const product = productMap.get(item.id)!
        return {
          id: product.id,
          title: product.name,
          quantity: item.cantidad,
          unit_price: Number(product.price),
          currency_id: 'CLP',
        }
      }),
      payer: {
        name: datosCliente.nombre,
        email: datosCliente.email,
        phone: { number: datosCliente.telefono || '' },
      },
      external_reference: order.id,
      notification_url: `${BASE_URL}/api/mercadopago/webhook`,
      back_urls: {
        success: `${BASE_URL}/pedido-exito`,
        failure: `${BASE_URL}/checkout`,
        pending: `${BASE_URL}/checkout`,
      },
      auto_return: 'approved',
      statement_descriptor: 'ROTHAR',
      binary_mode: true,
    }

    const response = await fetch('https://api.mercadopago.com/checkout/preferences', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${MP_ACCESS_TOKEN}`,
      },
      body: JSON.stringify(preference),
      signal: AbortSignal.timeout(30000),
    })

    const data = await response.json()

    if (!response.ok) {
      console.error('[PREFERENCE] MP error:', data)
      return NextResponse.json(
        { error: 'Error al crear preferencia' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      preferenceId: data.id,
      initPoint: data.init_point,
      orderId: order.id,
    })
  } catch (error) {
    console.error('[PREFERENCE] Error:', error)
    return NextResponse.json(
      { error: 'Error interno' },
      { status: 500 }
    )
  }
}
