import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import type { Post } from '@/generated/prisma';

export default async function BlogPreview() {
  const posts = await prisma.post.findMany({
    where: { isActive: true },
    orderBy: { createdAt: 'desc' },
    take: 3,
  });

  const getExcerpt = (content: string) => {
    // Decode HTML entities
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
    const plainText = decoded.replace(/<[^>]*>?/gm, '')
    return plainText.substring(0, 100) + '...'
  }

  return (
    <section className="py-20 bg-[#084C4C]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-display text-[#E6DAB9] tracking-wider mb-4">
            ÚLTIMAS PUBLICACIONES
          </h2>
          <div className="w-24 h-1 bg-[#E6DAB9] mx-auto mb-4"></div>
          <p className="text-[#E6DAB9]/70 text-lg">
            Consejos y guías de mecánica bicicleta
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {posts.map((post: Post) => (
            <div
              key={post.id}
              className="bg-[#063d3d] hover:shadow-xl transition-all duration-300 hover:-translate-y-2 overflow-hidden group"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={post.coverImage || 'https://via.placeholder.com/400x300'}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-display text-[#E6DAB9] tracking-wider mb-3 group-hover:text-[#E6DAB9] transition-colors">
                  {post.title}
                </h3>
                <p className="text-[#E6DAB9]/70 text-sm mb-4 line-clamp-2">
                  {getExcerpt(post.content)}
                </p>
                <Link
                  href={`/blog/${post.slug}`}
                  className="text-[#E6DAB9] font-medium hover:underline uppercase text-sm"
                >
                  Leer más →
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Link
            href="/blog"
            className="inline-block bg-[#E6DAB9] text-[#084C4C] px-8 py-4 font-display text-xl tracking-wider hover:bg-[#d4c9a5] transition-colors"
          >
            VER BLOG COMPLETO
          </Link>
        </div>
      </div>
    </section>
  );
}
