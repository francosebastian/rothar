 import Link from 'next/link';
import { products } from '@/data/products';

export default function ProductsPreview() {
  const featuredProducts = products.slice(0, 3);

  return (
    <section className="py-20 bg-[#E6DAB9]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-display text-[#084C4C] tracking-wider mb-4">
            PRODUCTOS DESTACADOS
          </h2>
          <div className="w-24 h-1 bg-[#084C4C] mx-auto mb-4"></div>
          <p className="text-[#084C4C]/70 text-lg">
            Las mejores partes y accesorios para tu bicicleta
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {featuredProducts.map((product) => (
            <div
              key={product.id}
              className="bg-[#084C4C] shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 overflow-hidden group"
            >
              <div className="relative h-64 overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <span className="absolute top-4 right-4 bg-[#E6DAB9] text-[#084C4C] text-xs font-medium px-3 py-1 uppercase">
                  {product.category}
                </span>
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
                  <button className="bg-[#E6DAB9] text-[#084C4C] px-4 py-2 text-sm font-medium hover:bg-[#d4c9a5] transition-colors uppercase">
                    Agregar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Link
            href="/tienda"
            className="inline-block bg-[#084C4C] text-[#E6DAB9] px-8 py-4 font-display text-xl tracking-wider hover:bg-[#063d3d] transition-colors"
          >
            VER TIENDA COMPLETA
          </Link>
        </div>
      </div>
    </section>
  );
}