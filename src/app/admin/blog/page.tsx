import { prisma } from '@/lib/prisma'
import { PostForm } from './PostForm'
import { PostList } from './PostList'
import { ToggleButton } from '@/components/ToggleButton'

export default async function AdminBlogPage() {
  const posts = await prisma.post.findMany({
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Gestionar Blog
        </h1>
        <ToggleButton targetId="post-form" label="Agregar Post" />
      </div>

      <div id="post-form" className="hidden mb-8">
        <PostForm />
      </div>

      <PostList posts={posts} />
    </div>
  )
}
