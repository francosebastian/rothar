import Image from 'next/image';
import Link from 'next/link';

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-[#084C4C] via-[#0a5c5c] to-[#084C4C]">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-10 w-64 h-64 border border-[#E6DAB9] rotate-45"></div>
          <div className="absolute bottom-40 right-20 w-40 h-40 border border-[#E6DAB9]/30 rotate-12"></div>
          <div className="absolute top-1/2 left-1/4 w-20 h-20 bg-[#E6DAB9] rounded-full opacity-10"></div>
        </div>
      </div>
      
      <div className="absolute inset-0 opacity-60 mix-blend-overlay">
        <Image 
          src="/taller.png" 
          alt="Taller Rothar" 
          fill
          style={{ objectFit: 'cover' }}
          quality={80} 
        />
      </div>

      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <h1 className="text-6xl md:text-8xl lg:text-9xl font-display tracking-[-0.05em] text-[#E6DAB9]  scale-y-110 tracking-wider mb-4 animate-fade-in-up">
          ROTHAR
        </h1>
        <p className="text-xl md:text-2xl text-[#E6DAB9]/80 font-display tracking-widest mb-2 animate-fade-in-up delay-100">
          WORKSHOP
        </p>
        <p className="text-lg md:text-xl text-[#E6DAB9] font-medium mb-8 animate-fade-in-up delay-200">
          Taller de Bicicletas & Tienda
        </p>
        <p className="text-[#E6DAB9]/70 text-lg mb-10 max-w-2xl mx-auto animate-fade-in-up delay-300">
          Mantenimiento, reparaciones y personalización para tu bicicleta. 
          Encuentra las mejores partes y accesorios.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up delay-400">
          <Link
            href="/servicios"
            className="bg-[#E6DAB9] text-[#084C4C] px-8 py-4 font-display text-xl tracking-wider hover:bg-[#d4c9a5] transition-colors"
          >
            SERVICIOS
          </Link>
          <Link
            href="/#contacto"
            className="border-2 border-[#E6DAB9] text-[#E6DAB9] px-8 py-4 font-display text-xl tracking-wider hover:bg-[#E6DAB9] hover:text-[#084C4C] transition-colors"
          >
            CONTACTAR
          </Link>
        </div>
      </div>

      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
        <svg className="w-8 h-8 text-[#E6DAB9]/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </section>
  );
}