import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, slug, price, category, image, description, stock, sku, isActive } = body

    if (!name || !slug || !price || !category) {
      return NextResponse.json({ error: 'Faltan campos obligatorios' }, { status: 400 })
    }

    const existing = await prisma.product.findUnique({
      where: { slug },
    })
    if (existing) {
      return NextResponse.json({ error: 'Slug ya existe' }, { status: 400 })
    }

    const product = await prisma.product.create({
      data: {
        name,
        slug,
        price: parseFloat(price),
        category,
        image,
        description,
        stock: parseInt(stock),
        sku,
        isActive: isActive ?? true,
      },
    })

    return NextResponse.json(product)
  } catch (error) {
    console.error('POST error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
