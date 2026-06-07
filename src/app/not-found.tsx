import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#063d3d] px-4">
      <div className="text-center max-w-md">
        <h1 className="text-8xl font-display text-[#E6DAB9] tracking-wider mb-4">
          404
        </h1>
        <div className="w-16 h-1 bg-[#E6DAB9] mx-auto mb-6"></div>
        <p className="text-[#E6DAB9]/70 text-lg mb-8">
          Página no encontrada.
        </p>
        <Link
          href="/"
          className="inline-block px-6 py-3 bg-[#E6DAB9] text-[#063d3d] font-display tracking-wider hover:bg-[#E6DAB9]/80 transition-colors"
        >
          VOLVER AL INICIO
        </Link>
      </div>
    </div>
  )
}
