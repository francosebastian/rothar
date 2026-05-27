import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
  try {
    const faqs = await prisma.faq.findMany({
      orderBy: { order: 'asc' },
    })
    return NextResponse.json(faqs)
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { question, answer, order, isActive } = body

    if (!question || !answer) {
      return NextResponse.json({ error: 'Faltan campos obligatorios' }, { status: 400 })
    }

    const faq = await prisma.faq.create({
      data: {
        question,
        answer,
        order: order ?? 0,
        isActive: isActive ?? true,
      },
    })

    return NextResponse.json(faq)
  } catch (error) {
    console.error('POST faq error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
