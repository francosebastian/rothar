import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const session = await auth()

  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const address = await prisma.shippingAddress.findUnique({
      where: { id },
    })

    if (!address || (address.userId !== user.id && user.role !== 'ADMIN')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    await prisma.shippingAddress.delete({
      where: { id },
    })

    return NextResponse.json({ message: 'Address deleted' }, { status: 200 })
  } catch (error) {
    console.error('Error deleting address:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const session = await auth()

  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { street, city, state, zipCode } = body

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const address = await prisma.shippingAddress.findUnique({
      where: { id },
    })

    if (!address || (address.userId !== user.id && user.role !== 'ADMIN')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const updatedAddress = await prisma.shippingAddress.update({
      where: { id },
      data: {
        street: street || undefined,
        city: city || undefined,
        state: state !== undefined ? state : undefined,
        zipCode: zipCode !== undefined ? zipCode : undefined,
      },
    })

    return NextResponse.json(updatedAddress)
  } catch (error) {
    console.error('Error updating address:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
