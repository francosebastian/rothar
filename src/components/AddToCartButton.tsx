'use client'

import { useState } from 'react'
import { useCartStore } from '@/lib/store'

interface Product {
  id: string
  name: string
  price: number
  image: string | null
  stock: number
}

export default function AddToCartButton({ product }: { product: Product }) {
  const [quantity, setQuantity] = useState(1)
  const addItem = useCartStore((state) => state.addItem)

  const addToCart = () => {
    addItem({
      id: product.id,
      nombre: product.name,
      precio: product.price,
      cantidad: quantity,
      imagen: product.image || undefined,
      tipo: 'producto',
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <label className="text-sm font-medium text-[#E6DAB9]/70 uppercase tracking-wider">Cantidad:</label>
        <select
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
          className="bg-[#063d3d] text-[#E6DAB9] border border-[#E6DAB9]/20 rounded px-4 py-2 focus:outline-none focus:border-[#E6DAB9] uppercase"
        >
          {[...Array(Math.min(product.stock, 10))].map((_, i) => (
            <option key={i + 1} value={i + 1}>
              {i + 1}
            </option>
          ))}
        </select>
      </div>

      <button
        onClick={addToCart}
        disabled={product.stock === 0}
        className="w-full bg-[#E6DAB9] text-[#084C4C] py-3 px-6 font-display text-lg tracking-wider uppercase hover:bg-[#d4c9a5] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {product.stock === 0 ? 'Sin stock' : 'Agregar al carro'}
      </button>
    </div>
  )
}
