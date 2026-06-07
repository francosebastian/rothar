'use client'

import { useEffect } from 'react'
import Link from 'next/link'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Error:', error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#063d3d] px-4">
      <div className="text-center max-w-md">
        <h1 className="text-6xl font-display text-[#E6DAB9] tracking-wider mb-4">
          ERROR
        </h1>
        <div className="w-16 h-1 bg-[#E6DAB9] mx-auto mb-6"></div>
        <p className="text-[#E6DAB9]/70 text-lg mb-8">
          Algo salió mal. Intenta de nuevo o vuelve al inicio.
        </p>
        <div className="flex gap-4 justify-center">
          <button
            onClick={reset}
            className="px-6 py-3 bg-[#E6DAB9] text-[#063d3d] font-display tracking-wider hover:bg-[#E6DAB9]/80 transition-colors"
          >
            REINTENTAR
          </button>
          <Link
            href="/"
            className="px-6 py-3 border border-[#E6DAB9] text-[#E6DAB9] font-display tracking-wider hover:bg-[#E6DAB9]/10 transition-colors"
          >
            VOLVER AL INICIO
          </Link>
        </div>
      </div>
    </div>
  )
}
