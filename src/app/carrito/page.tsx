'use client';

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useCartStore } from "@/lib/store";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";

export default function CartPage() {
  const items = useCartStore((state) => state.items);
  const removeItem = useCartStore((state) => state.removeItem);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const getTotal = useCartStore((state) => state.getTotal);
  const clearCart = useCartStore((state) => state.clearCart);

  if (items.length === 0) {
    return (
      <main className="flex min-h-screen flex-col">
        <Navbar />
        <section className="flex-1 flex items-center justify-center bg-[#E6DAB9]">
          <div className="text-center">
            <h2 className="text-3xl font-display text-[#084C4C] mb-4">Tu carrito está vacío</h2>
            <p className="text-[#084C4C]/70 mb-8">Agrega productos desde nuestra tienda</p>
            <Link 
              href="/tienda"
              className="bg-[#084C4C] text-[#E6DAB9] px-8 py-4 font-display text-lg tracking-wider hover:bg-[#063d3d] transition-colors inline-block"
            >
              IR A LA TIENDA
            </Link>
          </div>
        </section>
        <Footer />
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col">
      <Navbar />
      
      <section className="flex-1 py-20 bg-[#E6DAB9]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-display text-[#084C4C] tracking-wider mb-8">
            CARRITO DE COMPRAS
          </h1>

          <div className="bg-[#084C4C] shadow-lg p-6 mb-8">
            {items.map((item) => (
              <div key={item.id} className="flex items-center gap-4 py-4 border-b border-[#E6DAB9]/20 last:border-0">
                {item.imagen && (
                  <div className="w-20 h-20 relative flex-shrink-0">
                    <Image 
                      src={item.imagen} 
                      alt={item.nombre}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <div className="flex-1">
                  <h3 className="text-[#E6DAB9] font-display tracking-wider">{item.nombre}</h3>
                  <p className="text-[#E6DAB9]/70 text-sm">${item.precio.toLocaleString('es-CL')}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => updateQuantity(item.id, item.cantidad - 1)}
                    className="w-8 h-8 bg-[#E6DAB9] text-[#084C4C] flex items-center justify-center hover:bg-[#d4c9a5] transition-colors"
                  >
                    -
                  </button>
                  <span className="text-[#E6DAB9] w-8 text-center">{item.cantidad}</span>
                  <button 
                    onClick={() => updateQuantity(item.id, item.cantidad + 1)}
                    className="w-8 h-8 bg-[#E6DAB9] text-[#084C4C] flex items-center justify-center hover:bg-[#d4c9a5] transition-colors"
                  >
                    +
                  </button>
                </div>
                <div className="text-[#E6DAB9] font-display min-w-[100px] text-right">
                  ${(item.precio * item.cantidad).toLocaleString('es-CL')}
                </div>
                <button 
                  onClick={() => removeItem(item.id)}
                  className="text-[#E6DAB9]/70 hover:text-red-400 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>

          <div className="bg-[#084C4C] shadow-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <span className="text-2xl font-display text-[#E6DAB9] tracking-wider">TOTAL</span>
              <span className="text-3xl font-display text-[#E6DAB9]">
                ${getTotal().toLocaleString('es-CL')}
              </span>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                onClick={clearCart}
                className="flex-1 bg-transparent border-2 border-[#E6DAB9] text-[#E6DAB9] px-6 py-3 font-display tracking-wider hover:bg-[#E6DAB9] hover:text-[#084C4C] transition-colors"
              >
                VACIAR CARRITO
              </button>
              <Link 
                href="/checkout"
                className="flex-1 bg-[#E6DAB9] text-[#084C4C] px-6 py-3 font-display text-lg tracking-wider text-center hover:bg-[#d4c9a5] transition-colors"
              >
                PROCEDER AL PAGO
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
