import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function proxy(request: NextRequest) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET })
  
  const isAdminRoute = request.nextUrl.pathname.startsWith('/admin')
  const isAuthRoute = request.nextUrl.pathname.startsWith('/login') || 
                      request.nextUrl.pathname.startsWith('/registro')

  // Si intenta acceder a admin sin estar logueado
  if (isAdminRoute && !token) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Si es admin route pero no es admin
  if (isAdminRoute && token?.role !== 'ADMIN') {
    return new NextResponse('Acceso denegado - Se requiere rol ADMIN', { status: 403 })
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/perfil/:path*', '/login', '/registro']
}
