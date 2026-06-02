import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { prisma } from '@/lib/prisma'
import { sendOrderConfirmationEmail, sendAdminOrderNotification } from '@/lib/email'
import type { OrderEmailData } from '@/lib/email'

const MP_ACCESS_TOKEN = process.env.MERCADO_PAGO_ACCESS_TOKEN
const WEBHOOK_SECRET = process.env.MP_WEBHOOK_SECRET

function validateSignature(body: string, signature: string | null): boolean {
  if (!signature) {
    console.error('[WEBHOOK] No signature')
    return process.env.NODE_ENV === 'development'
  }
  if (!WEBHOOK_SECRET) {
    console.warn('[WEBHOOK] WEBHOOK_SECRET not set')
    return process.env.NODE_ENV === 'development'
  }
  try {
    const parts = signature.split(',')
    let ts = ''
    let hash = ''
    for (const p of parts) {
      const [k, v] = p.split('=')
      if (k === 'ts') ts = v
      if (k === 'v1') hash = v
    }
    if (!ts || !hash) return false

    if (Date.now() - parseInt(ts) * 1000 > 300000) return false

    const expected = crypto
      .createHmac('sha256', WEBHOOK_SECRET)
      .update(`${ts}.${body}`)
      .digest('hex')

    return crypto.timingSafeEqual(Buffer.from(hash), Buffer.from(expected))
  } catch (e) {
    console.error('[WEBHOOK] Signature error:', e)
    return false
  }
}

export async function POST(request: NextRequest) {
  try {
    const raw = await request.text()
    const signature = request.headers.get('x-signature')
    const topic = request.headers.get('x-topic') || request.headers.get('x-mercado-pago-topic') || 'payment'

    console.log(`[WEBHOOK] ${topic}`)

    if (!validateSignature(raw, signature))
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    let payload: any
    try { payload = JSON.parse(raw) } catch {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
    }

    if (topic === 'payment' || payload.type === 'payment')
      return handlePayment(payload)

    return NextResponse.json({ received: true })
  } catch (e) {
    console.error('[WEBHOOK] Error:', e)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}

async function handlePayment(payload: any) {
  const paymentId = payload.data?.id?.toString()
  if (!paymentId)
    return NextResponse.json({ error: 'Missing payment_id' }, { status: 400 })

  const mp = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
    headers: { Authorization: `Bearer ${MP_ACCESS_TOKEN}` },
  })
  if (!mp.ok) {
    console.error(`[WEBHOOK] MP fetch failed: ${mp.status}`)
    return NextResponse.json({ error: 'Payment fetch failed' }, { status: 502 })
  }

  const payment = await mp.json()
  if (payment.status !== 'approved') {
    console.log(`[WEBHOOK] Payment ${paymentId} → ${payment.status}`)
    return NextResponse.json({ received: true })
  }

  const orderId = payment.external_reference
  if (!orderId) {
    console.error('[WEBHOOK] No external_reference')
    return NextResponse.json({ error: 'Missing order ref' }, { status: 400 })
  }

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { items: { include: { product: true } } },
  })
  if (!order) {
    console.error(`[WEBHOOK] Order ${orderId} not found`)
    return NextResponse.json({ error: 'Order not found' }, { status: 404 })
  }
  if (order.status === 'PAID') {
    console.log(`[WEBHOOK] Order ${orderId} already PAID`)
    return NextResponse.json({ received: true })
  }
  if (order.status !== 'PENDING') {
    console.error(`[WEBHOOK] Order ${orderId} state: ${order.status}`)
    return NextResponse.json({ error: 'Invalid state' }, { status: 400 })
  }

  const paid = payment.transaction_details?.total_paid_amount ?? payment.transaction_amount
  if (paid < Number(order.total) - 1) {
    console.error(`[WEBHOOK] Amount mismatch: ${paid} vs ${order.total}`)
    return NextResponse.json({ error: 'Amount mismatch' }, { status: 400 })
  }

  for (const item of order.items) {
    await prisma.product.update({
      where: { id: item.productId },
      data: { stock: { decrement: item.quantity } },
    })
  }

  await prisma.order.update({
    where: { id: orderId },
    data: { status: 'PAID', paymentId: payment.id?.toString() },
  })
  console.log(`[WEBHOOK] Order ${orderId} → PAID`)

  const emailData: OrderEmailData = {
    orderId: order.id,
    customerName: order.customerName,
    customerEmail: order.customerEmail,
    items: order.items.map(i => ({
      name: i.product.name,
      quantity: i.quantity,
      price: Number(i.price),
    })),
    total: Number(order.total),
    shippingAddress: order.shippingAddress,
  }

  sendOrderConfirmationEmail(emailData).catch(e =>
    console.error('[WEBHOOK] Email err:', e)
  )
  sendAdminOrderNotification(emailData).catch(e =>
    console.error('[WEBHOOK] Admin email err:', e)
  )

  return NextResponse.json({ received: true })
}
