import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { prisma } from "@/lib/prisma";
import Link from 'next/link';
import type { Post } from '@/generated/prisma';

function decodeEntities(content: string) {
  const decoded = content
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&aacute;/g, 'á')
    .replace(/&eacute;/g, 'é')
    .replace(/&iacute;/g, 'í')
    .replace(/&oacute;/g, 'ó')
    .replace(/&uacute;/g, 'ú')
  
  // Strip HTML tags
  return decoded.replace(/<[^>]*>?/gm, '')
}

export default async function BlogPage() {
  const posts = await prisma.post.findMany({
    where: { isActive: true },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <main className="flex min-h-screen flex-col">
      <Navbar />
      
      <section className="pt-32 pb-20 bg-[#063d3d]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-7xl font-display text-[#E6DAB9] tracking-wider mb-4 animate-fade-in-up">
            EL BLOG DE ROTHAR
          </h1>
          <div className="w-24 h-1 bg-[#E6DAB9] mx-auto mb-8 animate-fade-in-up delay-100"></div>
          <p className="text-[#E6DAB9]/70 text-lg max-w-2xl mx-auto animate-fade-in-up delay-200">
            Consejos de mecánica, tutoriales paso a paso y noticias del mundo del ciclismo 
            directamente desde nuestro taller.
          </p>
        </div>
      </section>

      <section className="py-20 bg-[#E6DAB9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {posts.map((post: Post) => (
              <div
                key={post.id}
                className="flex flex-col bg-[#084C4C] hover:shadow-2xl transition-all duration-300 group"
              >
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={post.coverImage || 'https://via.placeholder.com/600x400'}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                </div>
                <div className="p-8 flex-1 flex flex-col">
                  <div className="flex items-center gap-4 text-sm text-[#E6DAB9]/70 mb-4">
                    <span>{new Date(post.createdAt).toLocaleDateString('es-AR')}</span>
                  </div>
                  <h2 className="text-3xl font-display text-[#E6DAB9] tracking-wider mb-4 group-hover:text-[#E6DAB9] transition-colors leading-tight">
                    {post.title}
                  </h2>
                  <p className="text-[#E6DAB9]/70 text-lg mb-6 line-clamp-3">
                    {decodeEntities(post.content.substring(0, 150))}...
                  </p>
                  <div className="mt-auto">
                    <Link
                      href={`/blog/${post.slug}`}
                      className="inline-block bg-[#E6DAB9] text-[#084C4C] px-6 py-3 font-display text-lg tracking-wider hover:bg-[#d4c9a5] transition-colors"
                    >
                      CONTINUAR LEYENDO
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

export const revalidate = 60;
