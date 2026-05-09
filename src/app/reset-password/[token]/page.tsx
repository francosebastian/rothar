'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'

export default function ResetPasswordPage({ params }: { params: Promise<{ token: string }> }) {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden')
      setLoading(false)
      return
    }

    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres')
      setLoading(false)
      return
    }

    try {
      const { token } = await params
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      })

      if (res.ok) {
        setSuccess(true)
      } else {
        const data = await res.json()
        setError(data.error || 'Error al restablecer la contraseña')
      }
    } catch {
      setError('Error de conexión')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
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
              CONTRASEÑA ACTUALIZADA
            </h2>
            <p className="text-[#E6DAB9]/70 mb-6">
              Tu contraseña se actualizó correctamente. Ahora podés iniciar sesión con tu nueva contraseña.
            </p>
            <Link
              href="/login"
              className="inline-block bg-green-600 text-white px-6 py-3 font-display tracking-wider hover:bg-green-700 transition-colors"
            >
              INICIAR SESIÓN
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
            NUEVA CONTRASEÑA
          </h2>
          <p className="mt-2 text-sm text-[#E6DAB9]/70">
            Elegí una nueva contraseña para tu cuenta.
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
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="appearance-none block w-full px-3 py-2 border border-[#E6DAB9]/20 bg-[#084C4C] text-[#E6DAB9] placeholder-[#E6DAB9]/50 focus:outline-none focus:ring-[#E6DAB9] focus:border-[#E6DAB9] sm:text-sm"
              placeholder="Nueva contraseña (mín. 6 caracteres)"
              minLength={6}
            />
          </div>

          <div>
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="appearance-none block w-full px-3 py-2 border border-[#E6DAB9]/20 bg-[#084C4C] text-[#E6DAB9] placeholder-[#E6DAB9]/50 focus:outline-none focus:ring-[#E6DAB9] focus:border-[#E6DAB9] sm:text-sm"
              placeholder="Confirmar nueva contraseña"
              minLength={6}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 text-white py-3 font-display tracking-wider hover:bg-green-700 transition-colors disabled:opacity-50"
          >
            {loading ? 'GUARDANDO...' : 'GUARDAR CONTRASEÑA'}
          </button>
        </form>
      </div>
    </div>
  )
}
