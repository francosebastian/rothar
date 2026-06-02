'use client'

import { useRouter } from 'next/navigation'
import type { Post } from '@/generated/prisma'

export function PostList({ posts }: { posts: Post[] }) {
  const router = useRouter()

  const deletePost = async (id: string) => {
    if (!confirm('¿Seguro que deseas eliminar este post?')) return

    await fetch(`/api/admin/blog/${id}`, { method: 'DELETE' })
    router.refresh()
  }

  const editPost = (post: Post) => {
    // Para simplificar la edición, redirigimos a una nueva ruta de edición
    router.push(`/admin/blog/${post.id}/edit`)
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Título</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Acciones</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {posts.map((post) => (
            <tr key={post.id}>
              <td className="px-6 py-4 text-sm font-medium text-gray-900">{post.title}</td>
              <td className="px-6 py-4">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${post.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {post.isActive ? 'Activo' : 'Inactivo'}
                </span>
              </td>
              <td className="px-6 py-4 text-right text-sm space-x-2">
                <button onClick={() => editPost(post)} className="text-indigo-600 hover:text-indigo-900">Editar</button>
                <button onClick={() => deletePost(post.id)} className="text-red-600 hover:text-red-900">Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
