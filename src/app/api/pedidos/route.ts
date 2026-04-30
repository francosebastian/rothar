import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { datos_cliente, items, total } = body;

    if (!datos_cliente || !items || !total) {
      return NextResponse.json(
        { error: 'Faltan datos requeridos' },
        { status: 400 }
      );
    }

    const pedido = {
      id: `PED-${Date.now()}`,
      datos_cliente,
      items,
      total,
      estado: 'pendiente',
      created_at: new Date().toISOString(),
    };

    return NextResponse.json({ 
      success: true, 
      pedido,
      message: 'Pedido creado exitosamente' 
    });

  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { error: 'Error al procesar el pedido' },
      { status: 500 }
    );
  }
}
