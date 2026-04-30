'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useCartStore } from '@/lib/store';

export default function CartSummary() {
  const [mounted, setMounted] = useState(false);
  const items = useCartStore((state) => state.items);
  const getTotal = useCartStore((state) => state.getTotal);
  const getItemCount = useCartStore((state) => state.getItemCount);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || items.length === 0) return null;

  return (
    <Link 
      href="/carrito"
      className="fixed bottom-4 right-4 bg-[#084C4C] text-[#E6DAB9] p-4 shadow-lg z-40 hover:bg-[#063d3d] transition-colors"
    >
      <div className="flex items-center gap-3">
        <div className="relative">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
          </svg>
          <span className="absolute -top-2 -right-2 bg-[#E6DAB9] text-[#084C4C] text-xs w-5 h-5 flex items-center justify-center rounded-full font-bold">
            {getItemCount()}
          </span>
        </div>
        <div>
          <p className="text-sm font-medium">${getTotal().toLocaleString('es-CL')}</p>
        </div>
      </div>
    </Link>
  );
}
