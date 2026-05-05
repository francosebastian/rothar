'use client'

import Link from 'next/link'
import { signOut } from 'next-auth/react'

export default function AdminNav() {
  return (
    <nav className="w-64 bg-gray-900 text-white min-h-screen p-6">
      <div className="mb-8">
        <h2 className="text-xl font-bold">Rothar Admin</h2>
      </div>

      <ul className="space-y-2">
        <li>
          <Link
            href="/admin"
            className="block py-2 px-4 rounded hover:bg-gray-800 transition"
          >
            Dashboard
          </Link>
        </li>
        <li>
          <Link
            href="/admin/productos"
            className="block py-2 px-4 rounded hover:bg-gray-800 transition"
          >
            Productos
          </Link>
        </li>
        <li>
          <Link
            href="/admin/pedidos"
            className="block py-2 px-4 rounded hover:bg-gray-800 transition"
          >
            Pedidos
          </Link>
        </li>
        <li>
          <Link
            href="/admin/usuarios"
            className="block py-2 px-4 rounded hover:bg-gray-800 transition"
          >
            Usuarios
          </Link>
        </li>
      </ul>

      <div className="mt-auto pt-8">
        <button
          onClick={() => signOut({ callbackUrl: '/' })}
          className="w-full py-2 px-4 bg-red-600 text-white rounded hover:bg-red-700 transition"
        >
          Cerrar Sesión
        </button>
      </div>
    </nav>
  )
}
