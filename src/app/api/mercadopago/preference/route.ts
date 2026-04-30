import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { items, total, datos_cliente } = body;

    const preference = {
      items: items.map((item: any) => ({
        id: item.id,
        title: item.nombre,
        quantity: item.cantidad,
        unit_price: item.precio,
        currency_id: 'CLP',
      })),
      payer: {
        name: datos_cliente.nombre,
        email: datos_cliente.email,
        phone: {
          number: datos_cliente.telefono,
        },
      },
      back_urls: {
        success: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3001'}/pedido-exito`,
        failure: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3001'}/checkout`,
        pending: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3001'}/checkout`,
      },
      auto_return: 'approved',
      external_reference: `PED-${Date.now()}`,
    };

    const response = await fetch('https://api.mercadopago.com/checkout/preferences', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.MERCADO_PAGO_ACCESS_TOKEN}`,
      },
      body: JSON.stringify(preference),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('MercadoPago error:', errorData);
      return NextResponse.json(
        { error: 'Error al crear preferencia de pago' },
        { status: 500 }
      );
    }

    const data = await response.json();
    
    return NextResponse.json({
      id: data.id,
      init_point: data.init_point,
    });

  } catch (error) {
    console.error('Error creating preference:', error);
    return NextResponse.json(
      { error: 'Error al procesar el pago' },
      { status: 500 }
    );
  }
}
