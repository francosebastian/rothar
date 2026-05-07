import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { title, slug, content, coverImage, isActive } = body

    if (slug) {
      const existing = await prisma.post.findFirst({
        where: { slug, NOT: { id } },
      })
      if (existing) {
        return NextResponse.json({ error: 'Slug ya existe' }, { status: 400 })
      }
    }

    const post = await prisma.post.update({
      where: { id },
      data: {
        ...(title && { title }),
        ...(slug && { slug }),
        ...(content !== undefined && { content }),
        ...(coverImage !== undefined && { coverImage }),
        ...(isActive !== undefined && { isActive }),
      },
    })

    return NextResponse.json(post)
  } catch (error) {
    console.error('PUT error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await prisma.post.delete({
      where: { id },
    })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('DELETE error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
