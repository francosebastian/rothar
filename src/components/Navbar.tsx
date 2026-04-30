'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCartStore } from '@/lib/store';
import { useEffect as useLayoutEffect } from 'react';

interface NavItem {
  label: string;
  href: string;
}

const navItems: NavItem[] = [
  { label: 'INICIO', href: '/' },
  { label: 'SERVICIOS', href: '/servicios' },
  { label: 'TIENDA', href: '/tienda' },
  { label: 'BLOG', href: '/blog' },
  { label: 'VIDEOS', href: '/videos' },
  { label: 'CONTACTO', href: '/#contacto' },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const itemCount = useCartStore((state) => state.items.reduce((acc, item) => acc + item.cantidad, 0));
  const itemsLength = useCartStore((state) => state.items.length);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isHome = pathname === '/';

  if (!mounted) return null;

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled || !isHome
          ? 'bg-[#063d3d] shadow-lg'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          <Link href="/" className="flex items-center gap-2">
            <Image 
              src="/logo.png" 
              alt="Logo Rothar Workshop" 
              width={160} 
              height={35} 
              className="object-contain"
              style={{ width: 'auto', height: 'auto' }}
            />
          </Link>

           <div className="hidden lg:flex items-center gap-8">
             {navItems.map((item) => (
               <Link
                 key={item.href}
                 href={item.href}
                 className="text-[#E6DAB9] font-medium hover:text-[#E6DAB9]/70 transition-colors uppercase tracking-wide text-sm"
               >
                 {item.label}
               </Link>
             ))}
              <Link href="/carrito" className="relative text-[#E6DAB9] hover:text-[#E6DAB9]/70 transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
                </svg>
                {itemsLength > 0 && (
                  <span className="absolute -top-2 -right-2 bg-[#E6DAB9] text-[#084C4C] text-xs w-5 h-5 flex items-center justify-center rounded-full font-bold">
                    {itemCount}
                  </span>
                )}
              </Link>
           </div>

          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden text-[#E6DAB9] p-2 cursor-pointer"
            aria-label="Menu"
          >
            <svg
              className="w-6 h-6 pointer-events-none"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      <div
        className={`lg:hidden bg-[#063d3d] transition-all duration-300 overflow-hidden ${
          isMobileMenuOpen ? 'max-h-96' : 'max-h-0'
        }`}
      >
        <div className="px-4 py-4 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className="block text-[#E6DAB9] py-3 hover:text-[#E6DAB9]/70 transition-colors uppercase cursor-pointer"
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}