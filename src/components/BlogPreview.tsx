import Link from 'next/link';
import { blogPosts } from '@/data/blog';

export default function BlogPreview() {
  const latestPosts = blogPosts.slice(0, 2);

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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {latestPosts.map((post) => (
            <div
              key={post.id}
              className="bg-[#063d3d] hover:shadow-xl transition-all duration-300 hover:-translate-y-2 overflow-hidden group"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <span className="absolute top-4 left-4 bg-[#E6DAB9] text-[#084C4C] text-xs font-medium px-3 py-1 uppercase">
                  {post.category}
                </span>
              </div>
              <div className="p-6">
                <div className="flex items-center gap-4 text-sm text-[#E6DAB9]/70 mb-3">
                  <span>{post.date}</span>
                  <span>•</span>
                  <span>{post.readTime}</span>
                </div>
                <h3 className="text-xl font-display text-[#E6DAB9] tracking-wider mb-3 group-hover:text-[#E6DAB9] transition-colors">
                  {post.title}
                </h3>
                <p className="text-[#E6DAB9]/70 text-sm mb-4 line-clamp-2">
                  {post.excerpt}
                </p>
                <Link
                  href={`/blog/${post.id}`}
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