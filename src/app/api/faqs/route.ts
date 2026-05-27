import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const faqs = await prisma.faq.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' },
    })
    return NextResponse.json(faqs)
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
