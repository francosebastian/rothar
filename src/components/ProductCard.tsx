'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useCartStore } from '@/lib/store';

interface ProductCardProps {
  product: {
    id: string;
    slug?: string;
    name: string;
    price: number;
    category: string;
    image: string;
    description: string;
    stock: number;
  };
}

export default function ProductCard({ product }: ProductCardProps) {
  const [added, setAdded] = useState(false);
  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem({
      id: product.id,
      nombre: product.name,
      precio: product.price,
      cantidad: 1,
      imagen: product.image,
      tipo: 'producto',
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const productSlug = product.slug || product.id;

  return (
    <Link href={`/tienda/${productSlug}`} className="block">
      <div className="bg-[#084C4C] shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 overflow-hidden group cursor-pointer">
        <div className="relative h-64 overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            className={`w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ${product.stock === 0 ? 'opacity-60' : ''}`}
          />
          <span className="absolute top-4 right-4 bg-[#E6DAB9] text-[#084C4C] text-xs font-medium px-3 py-1 uppercase">
            {product.category}
          </span>
          {product.stock === 0 && (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="bg-red-600 text-white text-sm font-display tracking-wider px-4 py-2 uppercase">
                Sin stock
              </span>
            </div>
          )}
        </div>
        <div className="p-6">
          <h3 className="text-xl font-display text-[#E6DAB9] tracking-wider mb-2">
            {product.name}
          </h3>
          <p className="text-[#E6DAB9]/70 text-sm mb-4 line-clamp-2">
            {product.description}
          </p>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-display text-[#E6DAB9]">
              ${product.price.toLocaleString('es-CL')}
            </span>
            <button 
              onClick={product.stock === 0 ? undefined : handleAddToCart}
              disabled={product.stock === 0}
              className={`px-4 py-2 text-sm font-medium transition-colors uppercase ${
                product.stock === 0
                  ? 'bg-gray-500 text-gray-300 cursor-not-allowed'
                  : added 
                    ? 'bg-green-600 text-white' 
                    : 'bg-[#E6DAB9] text-[#084C4C] hover:bg-[#d4c9a5]'
              }`}
            >
              {product.stock === 0 ? 'Sin stock' : added ? 'Añadido!' : 'Agregar al carro'}
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}
