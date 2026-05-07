import { prisma } from '@/lib/prisma'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { notFound } from 'next/navigation'
import he from 'he'

function formatContent(content: string) {
  if (content.trim().startsWith('<')) {
    return content
  }
  return content
    .split('\n\n')
    .map(paragraph => {
      const withBreaks = paragraph.trim().replace(/\n/g, '<br />')
      return `<p>${withBreaks}</p>`
    })
    .join('')
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params

  const post = await prisma.post.findUnique({
    where: { slug, isActive: true },
  })

  if (!post) {
    notFound()
  }

  const decodedContent = he.decode(post.content)
  const formattedContent = formatContent(decodedContent)

  return (
    <main className="flex min-h-screen flex-col">
      <Navbar />
      
      <article className="py-20 bg-[#E6DAB9]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {post.coverImage && (
            <div className="mb-8 rounded-lg overflow-hidden">
              <img
                src={post.coverImage}
                alt={post.title}
                className="w-full h-96 object-cover"
              />
            </div>
          )}
          
          <h1 className="text-4xl md:text-5xl font-display text-[#084C4C] tracking-wider mb-4">
            {post.title}
          </h1>
          
          <div className="text-sm text-[#084C4C]/70 mb-8">
            {new Date(post.createdAt).toLocaleDateString('es-AR')}
          </div>
          
          <div 
            className="prose prose-lg max-w-none text-[#084C4C]"
            dangerouslySetInnerHTML={{ __html: formattedContent }}
          />
        </div>
      </article>

      <Footer />
    </main>
  )
}
