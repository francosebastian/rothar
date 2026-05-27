import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, slug } = body

    if (!name || !slug) {
      return NextResponse.json({ error: 'Faltan campos obligatorios' }, { status: 400 })
    }

    const existing = await prisma.category.findFirst({
      where: { OR: [{ name }, { slug }] },
    })
    if (existing) {
      return NextResponse.json({ error: 'Categoría o slug ya existe' }, { status: 400 })
    }

    const category = await prisma.category.create({
      data: { name, slug },
    })

    return NextResponse.json(category)
  } catch (error) {
    console.error('POST category error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
