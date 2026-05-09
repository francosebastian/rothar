'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
    })

    if (result?.error) {
      setError('Credenciales inválidas')
      setLoading(false)
    } else {
      router.push('/')
      router.refresh()
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#063d3d] py-12 px-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
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
            Iniciar Sesión
          </h2>
          <p className="mt-2 text-sm text-[#E6DAB9]/70">
            O{' '}
            <a href="/registro" className="font-medium text-[#E6DAB9] hover:text-[#E6DAB9]/80">
              Registrate para recibir ofertas
            </a>
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-900/20 border border-red-500/50 text-red-400 px-4 py-3 rounded">
              {error}
            </div>
          )}
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email" className="sr-only">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-[#E6DAB9]/20 bg-[#084C4C] text-[#E6DAB9] placeholder-[#E6DAB9]/50 rounded-t-md focus:outline-none focus:ring-[#E6DAB9] focus:border-[#E6DAB9] focus:z-10 sm:text-sm"
                placeholder="Email"
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Contraseña
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-[#E6DAB9]/20 bg-[#084C4C] text-[#E6DAB9] placeholder-[#E6DAB9]/50 rounded-b-md focus:outline-none focus:ring-[#E6DAB9] focus:border-[#E6DAB9] focus:z-10 sm:text-sm"
                placeholder="Contraseña"
              />
            </div>
          </div>

          <div className="flex items-center justify-end">
            <Link
              href="/olvide-password"
              className="text-sm text-[#E6DAB9]/70 hover:text-[#E6DAB9] transition-colors"
            >
              ¿Olvidaste tu contraseña?
            </Link>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-[#084C4C] bg-[#E6DAB9] hover:bg-[#E6DAB9]/80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#E6DAB9] disabled:opacity-50"
            >
              {loading ? 'Ingresando...' : 'Iniciar Sesión'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
