'use client';

import { useState } from 'react';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CartSummary from "@/components/CartSummary";
import ProductCard from "@/components/ProductCard";
import { products, categories } from "@/data/products";

export default function TiendaPage() {
  const [activeCategory, setActiveCategory] = useState("Todos");

  const filteredProducts = activeCategory === "Todos"
    ? products
    : products.filter(p => p.category === activeCategory);

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

           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
             {filteredProducts.map((product) => (
               <ProductCard key={product.id} product={product} />
             ))}
           </div>

           <CartSummary />
        </div>
      </section>

      <Footer />
    </main>
  );
}