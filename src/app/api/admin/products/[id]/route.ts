import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { name, slug, price, category, image, description, stock, sku, isActive } = body

    if (slug) {
      const existing = await prisma.product.findFirst({
        where: { slug, NOT: { id } },
      })
      if (existing) {
        return NextResponse.json({ error: 'Slug ya existe' }, { status: 400 })
      }
    }

    const product = await prisma.product.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(slug && { slug }),
        ...(price !== undefined && { price }),
        ...(category && { category }),
        ...(image !== undefined && { image }),
        ...(description !== undefined && { description }),
        ...(stock !== undefined && { stock }),
        ...(sku !== undefined && { sku }),
        ...(isActive !== undefined && { isActive }),
      },
    })

    return NextResponse.json(product)
  } catch (error) {
    console.error('PUT error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
