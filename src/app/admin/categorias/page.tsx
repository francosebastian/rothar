'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'

interface Category {
  id: string
  name: string
  slug: string
}

export default function AdminCategoriasPage() {
  const router = useRouter()
  const [categories, setCategories] = useState<Category[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<Category | null>(null)
  const [name, setName] = useState('')
  const [slug, setSlug] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const fetchCategories = useCallback(async () => {
    const res = await fetch('/api/categories')
    if (res.ok) setCategories(await res.json())
  }, [])

  useEffect(() => { fetchCategories() }, [fetchCategories])

  const openCreate = () => {
    setEditing(null); setName(''); setSlug(''); setError(''); setShowForm(true)
  }

  const openEdit = (cat: Category) => {
    setEditing(cat); setName(cat.name); setSlug(cat.slug); setError(''); setShowForm(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true); setError('')
    try {
      const url = editing ? `/api/admin/categories/${editing.id}` : '/api/admin/categories'
      const method = editing ? 'PUT' : 'POST'
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name, slug }) })
      if (res.ok) { setShowForm(false); fetchCategories(); router.refresh() }
      else { const d = await res.json(); setError(d.error) }
    } catch { setError('Error de conexión') }
    finally { setLoading(false) }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('¿Eliminar esta categoría?')) return
    const res = await fetch(`/api/admin/categories/${id}`, { method: 'DELETE' })
    if (res.ok) { fetchCategories(); router.refresh() }
    else { const d = await res.json(); alert(d.error) }
  }

  const generateSlug = (val: string) => val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Gestionar Categorías</h1>
        <button onClick={openCreate} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">+ Agregar Categoría</button>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setShowForm(false)}>
          <div className="bg-[#E6DAB9] p-6 rounded-lg shadow-xl max-w-md w-full mx-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-display tracking-wider text-[#084C4C]">{editing ? 'EDITAR CATEGORÍA' : 'NUEVA CATEGORÍA'}</h2>
              <button onClick={() => setShowForm(false)} className="text-[#084C4C] text-2xl">&times;</button>
            </div>
            {error && <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">{error}</div>}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#084C4C]">NOMBRE</label>
                <input type="text" required value={name} onChange={(e) => { setName(e.target.value); if (!editing) setSlug(generateSlug(e.target.value)) }} className="mt-1 block w-full px-3 py-2 border border-[#084C4C]/30 rounded-md shadow-sm bg-white" />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#084C4C]">SLUG</label>
                <input type="text" required value={slug} onChange={(e) => setSlug(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-[#084C4C]/30 rounded-md shadow-sm bg-white" />
              </div>
              <div className="flex gap-4">
                <button type="submit" disabled={loading} className="flex-1 py-2 px-4 bg-[#084C4C] text-[#E6DAB9] rounded-md hover:bg-[#063d3d] disabled:opacity-50">{loading ? 'GUARDANDO...' : 'GUARDAR'}</button>
                <button type="button" onClick={() => setShowForm(false)} className="flex-1 py-2 px-4 border border-[#084C4C] text-[#084C4C] rounded-md hover:bg-[#d4c89a]">CANCELAR</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {categories.length === 0 ? (
        <div className="bg-[#E6DAB9] rounded-lg shadow p-6 text-center text-[#084C4C]">No hay categorías.</div>
      ) : (
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nombre</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Slug</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {categories.map((cat) => (
                <tr key={cat.id}>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{cat.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{cat.slug}</td>
                  <td className="px-6 py-4 text-right text-sm space-x-2">
                    <button onClick={() => openEdit(cat)} className="text-indigo-600 hover:text-indigo-900">Editar</button>
                    <button onClick={() => handleDelete(cat.id)} className="text-red-600 hover:text-red-900">Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
