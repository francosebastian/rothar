import { prisma } from '@/lib/prisma'
import { PostForm } from '../../PostForm'
import { notFound } from 'next/navigation'

export default async function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  
  const post = await prisma.post.findUnique({
    where: { id },
  })

  if (!post) {
    notFound()
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Editar Post</h1>
      <PostForm post={post} />
    </div>
  )
}
