import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Metadata } from 'next'
import AddToCartButton from '@/components/AddToCartButton'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

interface ProductPageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params
  const product = await prisma.product.findUnique({
    where: { slug },
  })

  if (!product) {
    return {
      title: 'Producto no encontrado | Rothar',
    }
  }

  return {
    title: `${product.name} | Rothar`,
    description: product.description || `Comprá ${product.name} en Rothar. Mejor calidad en componentes para bicicletas.`,
    keywords: [product.category, 'bicicleta', 'componentes', 'Rothar', product.name],
    openGraph: {
      title: product.name,
      description: product.description || `Comprá ${product.name} en Rothar`,
      images: product.image ? [product.image] : [],
      type: 'website',
    },
  }
}

export async function generateStaticParams() {
  const products = await prisma.product.findMany({
    where: { isActive: true },
    select: { slug: true },
  })

  return products.map((product) => ({
    slug: product.slug,
  }))
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params
  const product = await prisma.product.findUnique({
    where: { slug },
  })

  if (!product || !product.isActive) {
    notFound()
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: product.image,
    sku: product.sku,
    offers: {
      '@type': 'Offer',
      priceCurrency: 'ARS',
      price: product.price,
      availability: product.stock > 0 
        ? 'https://schema.org/InStock' 
        : 'https://schema.org/OutOfStock',
    },
    category: product.category,
  }

  return (
    <main className="min-h-screen bg-[#E6DAB9]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 pb-12 bg-[#063d3d]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/tienda"
            className="inline-flex items-center text-[#E6DAB9]/70 hover:text-[#E6DAB9] mb-6 font-medium transition-colors"
          >
            ← Volver a la tienda
          </Link>
          <h1 className="text-5xl md:text-7xl font-display text-[#E6DAB9] tracking-wider">
            {product.name.toUpperCase()}
          </h1>
          <div className="w-24 h-1 bg-[#E6DAB9] mt-4 mb-2"></div>
          <p className="text-[#E6DAB9]/70 text-lg">
            {product.category}
          </p>
        </div>
      </section>

      {/* Product Detail */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Image */}
            <div className="relative aspect-square rounded-lg overflow-hidden bg-[#084C4C] shadow-xl">
              {product.image ? (
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-[#E6DAB9]/50">
                  SIN IMAGEN
                </div>
              )}
            </div>

            {/* Info Card */}
            <div className="bg-[#084C4C] shadow-lg p-8 flex flex-col justify-center">
              <div className="mb-6">
                <span className="text-4xl font-display text-[#E6DAB9]">
                  ${Number(product.price).toLocaleString('es-CL')}
                </span>
              </div>

              {product.description && (
                <p className="text-[#E6DAB9]/70 mb-8 leading-relaxed">
                  {product.description}
                </p>
              )}

              <div className="mb-8">
                <span className={`inline-flex items-center px-4 py-2 text-sm font-medium uppercase ${
                  product.stock > 0 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {product.stock > 0 ? `En stock (${product.stock})` : 'Sin stock'}
                </span>
              </div>

              {product.sku && (
                <div className="mb-8 text-sm text-[#E6DAB9]/50">
                  SKU: {product.sku}
                </div>
              )}

              <AddToCartButton 
                product={{
                  id: product.id,
                  name: product.name,
                  price: Number(product.price),
                  image: product.image,
                  stock: product.stock,
                }}
              />
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
