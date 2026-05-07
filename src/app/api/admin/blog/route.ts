import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, slug, content, coverImage, isActive } = body

    const existing = await prisma.post.findUnique({
      where: { slug },
    })
    if (existing) {
      return NextResponse.json({ error: 'Slug ya existe' }, { status: 400 })
    }

    const post = await prisma.post.create({
      data: {
        title,
        slug,
        content,
        coverImage,
        isActive: isActive ?? true,
      },
    })

    return NextResponse.json(post)
  } catch (error) {
    console.error('POST error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
