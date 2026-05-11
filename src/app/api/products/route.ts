import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const search = searchParams.get('search')

    const where: any = {
      isActive: true,
    }

    if (category && category !== 'todos') {
      where.category = category
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ]
    }

    const products = await prisma.product.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    })

    type Product = Awaited<ReturnType<typeof prisma.product.findMany>>[number]

    // Convert Decimal to number for JSON serialization
    const serializedProducts = products.map((p: Product) => ({
      ...p,
      price: Number(p.price),
    }))

    return NextResponse.json(serializedProducts)
  } catch (error) {
    console.error('[API Products] Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
