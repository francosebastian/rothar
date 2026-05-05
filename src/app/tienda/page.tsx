'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import CartSummary from '@/components/CartSummary'
import ProductCard from '@/components/ProductCard'

const categories = [
  "Todos",
  "Transmisión",
  "Frenos",
  "Ruedas",
  "Dirección",
  "Sillin"
];

interface Product {
  id: string
  name: string
  price: number
  category: string
  image: string
  description: string
  stock: number
}

function TiendaContent() {
  const searchParams = useSearchParams()
  const searchQuery = searchParams.get('q') || ''
  const [activeCategory, setActiveCategory] = useState('Todos')
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true)
      try {
        const params = new URLSearchParams()
        if (activeCategory !== 'Todos') {
          params.set('category', activeCategory)
        }
        if (searchQuery) {
          params.set('search', searchQuery)
        }

        const res = await fetch(`/api/products?${params.toString()}`)
        if (res.ok) {
          const data = await res.json()
          setProducts(data)
        }
      } catch (error) {
        console.error('Error fetching products:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [activeCategory, searchQuery])

  const filteredProducts = searchQuery
    ? products.filter(
        (p) =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : products

  return (
    <main className="flex min-h-screen flex-col">
      <Navbar />

      <section className="pt-32 pb-20 bg-[#063d3d]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-7xl font-display text-[#E6DAB9] tracking-wider mb-4 animate-fade-in-up">
            TIENDA ONLINE
          </h1>
          <div className="w-24 h-1 bg-[#E6DAB9] mx-auto mb-8 animate-fade-in-up delay-100"></div>
          <p className="text-[#E6DAB9]/70 text-lg max-w-2xl mx-auto animate-fade-in-up delay-200">
            Encuentra los mejores componentes, herramientas y accesorios para tu bicicleta.
            Calidad garantizada para cada kilómetro.
          </p>
        </div>
      </section>

      <section className="py-12 bg-[#E6DAB9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-6 py-2 font-display text-lg tracking-wider transition-all duration-300 ${
                  activeCategory === cat
                    ? 'bg-[#084C4C] text-[#E6DAB9]'
                    : 'bg-[#084C4C] text-[#E6DAB9] hover:bg-[#063d3d] shadow-sm'
                }`}
              >
                {cat.toUpperCase()}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="text-center py-12">Cargando productos...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          <CartSummary />
        </div>
      </section>

      <Footer />
    </main>
  )
}

export default function TiendaPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          Cargando...
        </div>
      }
    >
      <TiendaContent />
    </Suspense>
  )
}
