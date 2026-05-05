import { NextRequest, NextResponse } from 'next/server'
import { hash } from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { UserRole } from '@/generated/prisma'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      name,
      email,
      password,
      phone,
      street,
      city,
      state,
      zipCode,
    } = body

    // Validate required fields
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Nombre, email y contraseña son requeridos' },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'El email ya está registrado' },
        { status: 400 }
      )
    }

    // Hash password
    const passwordHash = await hash(password, 10)

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        name,
        passwordHash,
        role: UserRole.CLIENT,
        phone: phone || null,
      },
    })

    // Create shipping address if provided
    if (street && city) {
      await prisma.shippingAddress.create({
        data: {
          userId: user.id,
          street,
          city,
          state: state || null,
          zipCode: zipCode || '',
          isDefault: true,
        },
      })
    }

    return NextResponse.json(
      { message: 'Usuario creado exitosamente' },
      { status: 201 }
    )
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
