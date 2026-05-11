'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useCartStore } from '@/lib/store'

export default function CartSummary() {
  const [mounted, setMounted] = useState(false)
  const pathname = usePathname()
  const items = useCartStore((state) => state.items)
  const getTotal = useCartStore((state) => state.getTotal)
  const getItemCount = useCartStore((state) => state.getItemCount)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted || items.length === 0) return null

  const isTienda = pathname?.startsWith('/tienda')

  return (
    <Link
      href="/carrito"
      className={`fixed bottom-4 right-4 bg-[#084C4C] text-[#E6DAB9] p-4 shadow-lg z-40 hover:bg-[#063d3d] transition-colors items-center gap-3 ${isTienda ? 'hidden lg:flex' : 'flex lg:hidden'}`}
    >
      <div className="relative">
        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
        </svg>
        <span className="absolute -top-2 -right-2 bg-[#E6DAB9] text-[#084C4C] text-xs w-5 h-5 flex items-center justify-center rounded-full font-bold">
          {getItemCount()}
        </span>
      </div>
      <div>
        <p className="text-sm font-medium">Pagar ${getTotal().toLocaleString('es-CL')}</p>
      </div>
    </Link>
  )
}
