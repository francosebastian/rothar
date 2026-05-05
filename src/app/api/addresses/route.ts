import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  const session = await auth()

  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { shippingAddresses: true },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json(user.shippingAddresses)
  } catch (error) {
    console.error('Error fetching addresses:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  const session = await auth()

  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { street, city, state, zipCode, userId } = body

    // Verify the user is adding to their own account or is admin
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    })

    if (!user || (user.id !== userId && user.role !== 'ADMIN')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const address = await prisma.shippingAddress.create({
      data: {
        userId: user.id,
        street,
        city,
        state: state || null,
        zipCode: zipCode || '',
        isDefault: false,
      },
    })

    return NextResponse.json(address, { status: 201 })
  } catch (error) {
    console.error('Error creating address:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
