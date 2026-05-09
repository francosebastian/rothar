import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function POST(req: Request) {
  try {
    const { token, password } = await req.json()

    if (!token || !password) {
      return NextResponse.json({ error: 'Token y contraseña requeridos' }, { status: 400 })
    }

    if (password.length < 6) {
      return NextResponse.json({ error: 'La contraseña debe tener al menos 6 caracteres' }, { status: 400 })
    }

    const user = await prisma.user.findUnique({
      where: { resetToken: token },
    })

    if (!user || !user.resetTokenExpires) {
      return NextResponse.json({ error: 'Token inválido' }, { status: 400 })
    }

    if (user.resetTokenExpires < new Date()) {
      return NextResponse.json({ error: 'Token expirado' }, { status: 400 })
    }

    const passwordHash = await bcrypt.hash(password, 10)

    await prisma.user.update({
      where: { id: user.id },
      data: {
        passwordHash,
        resetToken: null,
        resetTokenExpires: null,
      },
    })

    return NextResponse.json({ message: 'Contraseña actualizada' })
  } catch (error) {
    console.error('Reset password error:', error)
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}
