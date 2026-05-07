'use client'

import Link from 'next/link'
import { signOut } from 'next-auth/react'

export default function AdminNav() {
  return (
    <nav className="w-64 bg-[#063d3d] text-[#E6DAB9] min-h-screen p-6">
      <div className="mb-8">
        <h2 className="text-xl font-bold uppercase tracking-wide">Rothar Admin</h2>
      </div>

      <ul className="space-y-2">
        <li>
          <Link
            href="/admin"
            className="block py-2 px-4 rounded hover:bg-[#E6DAB9]/10 transition"
          >
            Dashboard
          </Link>
        </li>
        <li>
          <Link
            href="/admin/productos"
            className="block py-2 px-4 rounded hover:bg-[#E6DAB9]/10 transition"
          >
            Productos
          </Link>
        </li>
        <li>
          <Link
            href="/admin/blog"
            className="block py-2 px-4 rounded hover:bg-[#E6DAB9]/10 transition"
          >
            Blog
          </Link>
        </li>
        <li>
          <Link
            href="/admin/pedidos"
            className="block py-2 px-4 rounded hover:bg-[#E6DAB9]/10 transition"
          >
            Pedidos
          </Link>
        </li>
        <li>
          <Link
            href="/admin/usuarios"
            className="block py-2 px-4 rounded hover:bg-[#E6DAB9]/10 transition"
          >
            Usuarios
          </Link>
        </li>
      </ul>

      <div className="mt-auto pt-8">
        <button
          onClick={() => signOut({ callbackUrl: '/' })}
          className="w-full py-2 px-4 bg-[#E6DAB9] text-[#063d3d] rounded hover:bg-[#E6DAB9]/80 transition font-medium"
        >
          Cerrar Sesión
        </button>
      </div>
    </nav>
  )
}
