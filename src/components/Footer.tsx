import Image from 'next/image';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-[#063d3d] border-t border-[#E6DAB9]/10 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-6">
              <Image 
                src="/logo.png" 
                alt="Logo Rothar Workshop" 
                width={180} 
                height={45} 
                className="object-contain"
              />
            </Link>
            <p className="text-[#E6DAB9]/50 text-lg mb-8 max-w-md">
              Mantenimiento, reparaciones y personalización de bicicletas. 
              Pasión por la mecánica y el ciclismo.
            </p>
            <div className="flex gap-4">
              <a
                href="https://www.instagram.com/rothar__/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-[#E6DAB9]/5 flex items-center justify-center hover:bg-[#E6DAB9] transition-colors rounded-full"
              >
                <span className="sr-only">Instagram</span>
                <svg className="w-5 h-5 text-[#E6DAB9]" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a
                href="https://www.youtube.com/@rotharworkshop1"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-[#E6DAB9]/5 flex items-center justify-center hover:bg-[#E6DAB9] transition-colors rounded-full"
              >
                <span className="sr-only">YouTube</span>
                <svg className="w-5 h-5 text-[#E6DAB9]" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-[#E6DAB9] font-display text-xl tracking-wider mb-6">NAVEGACIÓN</h4>
            <ul className="space-y-4 text-[#E6DAB9]/50">
              <li><Link href="/" className="hover:text-[#E6DAB9] transition-colors">Inicio</Link></li>
              <li><Link href="/tienda" className="hover:text-[#E6DAB9] transition-colors">Tienda</Link></li>
              <li><Link href="/blog" className="hover:text-[#E6DAB9] transition-colors">Blog</Link></li>
              <li><Link href="/videos" className="hover:text-[#E6DAB9] transition-colors">Videos</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-[#E6DAB9] font-display text-xl tracking-wider mb-6">HORARIO</h4>
            <ul className="space-y-4 text-[#E6DAB9]/50">
              <li>Lunes - Viernes: 10:00 - 19:00</li>
              <li>Sábado: 10:00 - 14:00</li>
              <li>Domingo: Cerrado</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-[#E6DAB9]/5 pt-8 text-center text-[#E6DAB9]/30 text-sm">
          <p>© {new Date().getFullYear()} Rothar Workshop. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
}