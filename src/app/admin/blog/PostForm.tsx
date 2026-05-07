'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ImageUpload } from '@/components/ImageUpload'
import dynamic from 'next/dynamic'
import 'react-quill-new/dist/quill.snow.css'

const ReactQuill = dynamic(() => import('react-quill-new'), {
  ssr: false,
  loading: () => <p>Cargando editor...</p>
})

export function PostForm({ post, onCancel }: { post?: any, onCancel?: () => void }) {
  const router = useRouter()
  const [formData, setFormData] = useState(() => {
    // Convert plain text content to HTML if it's not already HTML
    let initialContent = post?.content || ''
    if (initialContent && !initialContent.trim().startsWith('<')) {
      initialContent = initialContent
          .split('\n')
          .filter(line => line.trim() !== '')
          .map(line => `<p>${line}</p>`)
          .join('')
    }

    return {
      id: post?.id || '',
      title: post?.title || '',
      slug: post?.slug || '',
      content: initialContent,
      coverImage: post?.coverImage || '',
      isActive: post?.isActive ?? true,
    }
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (
      e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const value = e.target.type === 'checkbox'
        ? (e.target as HTMLInputElement).checked
        : e.target.value

    setFormData({
      ...formData,
      [e.target.name]: value,
    })
  }

  const handleContentChange = (content: string) => {
    setFormData(prev => ({ ...prev, content }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const url = formData.id
          ? `/api/admin/blog/${formData.id}`
          : '/api/admin/blog'

      const res = await fetch(url, {
        method: formData.id ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (res.ok) {
        if (onCancel) {
          onCancel()
        } else {
          router.push('/admin/blog')
          router.refresh()
        }
      } else {
        const data = await res.json()
        setError(data.error || 'Error al guardar post')
      }
    } catch {
      setError('Error de conexión')
    } finally {
      setLoading(false)
    }
  }

  // Custom handler for images to use Uploadcare
  const imageHandler = () => {
    const input = document.createElement('input')
    input.setAttribute('type', 'file')
    input.setAttribute('accept', 'image/*')
    input.click()

    input.onchange = async () => {
      const file = input.files?.[0]
      if (!file) return

      try {
        // Use your existing Uploadcare setup
        const { UploadClient } = await import('@uploadcare/upload-client')
        const uploadClient = new UploadClient({
          publicKey: process.env.NEXT_PUBLIC_UPLOADCARE_PUBLIC_KEY!,
        })

        const result = await uploadClient.uploadFile(file)
        const imageUrl = `https://goc9lmmt47.ucarecd.net/${result.uuid}/${file.name}`

        const quill = (document.querySelector('.ql-editor') as any)?.__quill
        if (quill) {
          const range = quill.getSelection()
          quill.insertEmbed(range.index, 'image', imageUrl)
        }
      } catch (error) {
        console.error('Upload error:', error)
        alert('Error al subir la imagen')
      }
    }
  }

  const modules = {
    toolbar: {
      container: [
        [{ 'header': [1, 2, 3, false] }],
        ['bold', 'italic', 'underline'],
        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
        ['link', 'image', 'video'],
        ['clean']
      ],
      handlers: {
        'image': imageHandler
      }
    }
  }

  return (
      <div className="bg-[#E6DAB9] p-6 rounded-lg shadow">
        <h2 className="text-xl font-display tracking-wider text-[#084C4C] mb-4">
          {post ? 'EDITAR POST' : 'NUEVO POST'}
        </h2>

        {error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#084C4C]">TÍTULO</label>
            <input
                type="text"
                name="title"
                required
                value={formData.title}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-[#084C4C]/30 rounded-md shadow-sm focus:outline-none focus:ring-[#084C4C] focus:border-[#084C4C] sm:text-sm bg-white text-[#084C4C]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#084C4C]">SLUG</label>
            <input
                type="text"
                name="slug"
                required
                value={formData.slug}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-[#084C4C]/30 rounded-md shadow-sm focus:outline-none focus:ring-[#084C4C] focus:border-[#084C4C] sm:text-sm bg-white text-[#084C4C]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#084C4C]">IMAGEN DE PORTADA</label>
            <ImageUpload
                value={formData.coverImage}
                onChange={(url) => setFormData({ ...formData, coverImage: url })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#084C4C]">CONTENIDO</label>
            <ReactQuill
                theme="snow"
                value={formData.content}
                onChange={handleContentChange}
                modules={modules}
                className="bg-white text-[#084C4C]"
            />
          </div>

          <div className="flex items-center">
            <input
                type="checkbox"
                name="isActive"
                checked={formData.isActive}
                onChange={handleChange}
                className="h-4 w-4 text-[#084C4C]"
            />
            <label className="ml-2 block text-sm text-[#084C4C]">Post activo</label>
          </div>

          <button
              type="submit"
              disabled={loading}
              className="w-full py-2 px-4 bg-[#084C4C] text-[#E6DAB9] rounded-md"
          >
            {loading ? 'GUARDANDO...' : 'GUARDAR POST'}
          </button>
        </form>
      </div>
  )
}
