'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

export default function OlvidePasswordPage() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      if (res.ok) {
        setSent(true)
      } else {
        const data = await res.json()
        setError(data.error || 'Error al enviar el email')
      }
    } catch {
      setError('Error de conexión')
    } finally {
      setLoading(false)
    }
  }

  if (sent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#063d3d] py-12 px-4">
        <div className="max-w-md w-full text-center">
          <Link href="/" className="inline-block mb-6">
            <Image
              src="/logo.png"
              alt="Rothar Workshop"
              width={200}
              height={50}
              className="object-contain mx-auto"
              priority
            />
          </Link>
          <div className="bg-[#084C4C] p-8">
            <h2 className="text-2xl font-display text-[#E6DAB9] tracking-wider mb-4">
              REVISÁ TU EMAIL
            </h2>
            <p className="text-[#E6DAB9]/70 mb-6">
              Te enviamos un enlace para restablecer tu contraseña. Revisá tu bandeja de entrada.
            </p>
            <Link
              href="/login"
              className="inline-block bg-green-600 text-white px-6 py-3 font-display tracking-wider hover:bg-green-700 transition-colors"
            >
              VOLVER AL INICIO DE SESIÓN
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#063d3d] py-12 px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <Link href="/" className="inline-block mb-6">
            <Image
              src="/logo.png"
              alt="Rothar Workshop"
              width={200}
              height={50}
              className="object-contain mx-auto"
              priority
            />
          </Link>
          <h2 className="text-3xl font-extrabold text-[#E6DAB9] uppercase tracking-wide">
            OLVIDÉ MI CONTRASEÑA
          </h2>
          <p className="mt-2 text-sm text-[#E6DAB9]/70">
            Ingresá tu email y te enviaremos un enlace para restablecerla.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-900/20 border border-red-500/50 text-red-400 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <div>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="appearance-none block w-full px-3 py-2 border border-[#E6DAB9]/20 bg-[#084C4C] text-[#E6DAB9] placeholder-[#E6DAB9]/50 focus:outline-none focus:ring-[#E6DAB9] focus:border-[#E6DAB9] sm:text-sm"
              placeholder="Tu email"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 text-white py-3 font-display tracking-wider hover:bg-green-700 transition-colors disabled:opacity-50"
          >
            {loading ? 'ENVIANDO...' : 'ENVIAR ENLACE'}
          </button>

          <div className="text-center">
            <Link
              href="/login"
              className="text-sm text-[#E6DAB9]/70 hover:text-[#E6DAB9] transition-colors"
            >
              Volver al inicio de sesión
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}
