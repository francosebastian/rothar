import { NextRequest, NextResponse } from 'next/server';

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

    console.log('[PAYMENT] Sending to MercadoPago:', JSON.stringify(paymentData, null, 2));

    const response = await fetch('https://api.mercadopago.com/v1/payments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${MP_ACCESS_TOKEN}`,
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

    return NextResponse.json(data);

  } catch (error) {
    console.error('[PAYMENT] Error:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
