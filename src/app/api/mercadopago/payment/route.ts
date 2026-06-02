import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendOrderConfirmationEmail, sendAdminOrderNotification } from '@/lib/email'
import type { OrderEmailData } from '@/lib/email'

const MP_ACCESS_TOKEN = process.env.MERCADO_PAGO_ACCESS_TOKEN;

export async function POST(request: NextRequest) {
  if (!MP_ACCESS_TOKEN) {
    return NextResponse.json(
      { error: 'MercadoPago no configurado' },
      { status: 500 }
    );
  }

  try {
    const body = await request.json();
    
    console.log('[PAYMENT] Request body:', JSON.stringify(body, null, 2));

    const { token, payment_method_id, installments, transaction_amount, payer, external_reference } = body;

    if (!token || !transaction_amount || !payment_method_id) {
      return NextResponse.json(
        { error: 'Faltan datos del pago' },
        { status: 400 }
      );
    }

    const paymentData = {
      transaction_amount: Number(transaction_amount),
      token: token,
      description: external_reference || 'Compra en Rothar',
      installments: installments || 1,
      payment_method_id: payment_method_id,
      payer: {
        email: payer?.email || body.payer_email,
        identification: payer?.identification ? {
          type: payer.identification.type,
          number: payer.identification.number,
        } : undefined,
      },
      external_reference: external_reference,
    };

    const idempotencyKey = `payment_${external_reference}_${transaction_amount}`;

    console.log('[PAYMENT] Sending to MercadoPago:', JSON.stringify(paymentData, null, 2));

    const response = await fetch('https://api.mercadopago.com/v1/payments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${MP_ACCESS_TOKEN}`,
        'X-Idempotency-Key': idempotencyKey,
      },
      body: JSON.stringify(paymentData),
      signal: AbortSignal.timeout(30000),
    });

    const data = await response.json();
    console.log('[PAYMENT] MP response:', response.status, data);

    if (!response.ok) {
      return NextResponse.json(
        { error: data.error || data.message || 'Error al procesar el pago', details: data },
        { status: response.status }
      );
    }

    if (data.status === 'approved' && external_reference) {
      const order = await prisma.order.findUnique({
        where: { id: external_reference },
        include: { items: { include: { product: true } } },
      })
      if (order && order.status === 'PENDING') {
        for (const item of order.items) {
          await prisma.product.update({
            where: { id: item.productId },
            data: { stock: { decrement: item.quantity } },
          })
        }
        await prisma.order.update({
          where: { id: external_reference },
          data: { status: 'PAID', paymentId: data.id?.toString() },
        })
        console.log('[PAYMENT] Order PAID:', external_reference)

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
          console.error('[PAYMENT] Email err:', e)
        )
        sendAdminOrderNotification(emailData).catch(e =>
          console.error('[PAYMENT] Admin email err:', e)
        )
      }
    }

    return NextResponse.json(data);

  } catch (error) {
    console.error('[PAYMENT] Error:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
