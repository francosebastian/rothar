'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'

interface Faq {
  id: string
  question: string
  answer: string
  order: number
  isActive: boolean
}

export default function AdminFaqsPage() {
  const router = useRouter()
  const [faqs, setFaqs] = useState<Faq[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<Faq | null>(null)
  const [question, setQuestion] = useState('')
  const [answer, setAnswer] = useState('')
  const [order, setOrder] = useState(0)
  const [isActive, setIsActive] = useState(true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const fetchFaqs = useCallback(async () => {
    const res = await fetch('/api/admin/faqs')
    if (res.ok) setFaqs(await res.json())
  }, [])

  useEffect(() => { fetchFaqs() }, [fetchFaqs])

  const openCreate = () => {
    setEditing(null); setQuestion(''); setAnswer(''); setOrder(0); setIsActive(true); setError(''); setShowForm(true)
  }

  const openEdit = (faq: Faq) => {
    setEditing(faq); setQuestion(faq.question); setAnswer(faq.answer); setOrder(faq.order); setIsActive(faq.isActive); setError(''); setShowForm(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true); setError('')
    try {
      const url = editing ? `/api/admin/faqs/${editing.id}` : '/api/admin/faqs'
      const method = editing ? 'PUT' : 'POST'
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ question, answer, order, isActive }) })
      if (res.ok) { setShowForm(false); fetchFaqs(); router.refresh() }
      else { const d = await res.json(); setError(d.error) }
    } catch { setError('Error de conexión') }
    finally { setLoading(false) }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('¿Eliminar esta FAQ?')) return
    const res = await fetch(`/api/admin/faqs/${id}`, { method: 'DELETE' })
    if (res.ok) { fetchFaqs(); router.refresh() }
  }

  const toggleActive = async (faq: Faq) => {
    await fetch(`/api/admin/faqs/${faq.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isActive: !faq.isActive }),
    })
    fetchFaqs(); router.refresh()
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Gestionar FAQ</h1>
        <button onClick={openCreate} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">+ Agregar Pregunta</button>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setShowForm(false)}>
          <div className="bg-[#E6DAB9] p-6 rounded-lg shadow-xl max-w-lg w-full mx-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-display tracking-wider text-[#084C4C]">{editing ? 'EDITAR PREGUNTA' : 'NUEVA PREGUNTA'}</h2>
              <button onClick={() => setShowForm(false)} className="text-[#084C4C] text-2xl">&times;</button>
            </div>
            {error && <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">{error}</div>}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#084C4C]">PREGUNTA</label>
                <input type="text" required value={question} onChange={(e) => setQuestion(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-[#084C4C]/30 rounded-md shadow-sm bg-white" />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#084C4C]">RESPUESTA</label>
                <textarea required rows={4} value={answer} onChange={(e) => setAnswer(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-[#084C4C]/30 rounded-md shadow-sm bg-white" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#084C4C]">ORDEN</label>
                  <input type="number" value={order} onChange={(e) => setOrder(parseInt(e.target.value) || 0)} className="mt-1 block w-full px-3 py-2 border border-[#084C4C]/30 rounded-md shadow-sm bg-white" />
                </div>
                <div className="flex items-end pb-2">
                  <label className="flex items-center gap-2">
                    <input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} className="h-4 w-4 text-[#084C4C]" />
                    <span className="text-sm text-[#084C4C]">Activo</span>
                  </label>
                </div>
              </div>
              <div className="flex gap-4">
                <button type="submit" disabled={loading} className="flex-1 py-2 px-4 bg-[#084C4C] text-[#E6DAB9] rounded-md hover:bg-[#063d3d] disabled:opacity-50">{loading ? 'GUARDANDO...' : 'GUARDAR'}</button>
                <button type="button" onClick={() => setShowForm(false)} className="flex-1 py-2 px-4 border border-[#084C4C] text-[#084C4C] rounded-md hover:bg-[#d4c89a]">CANCELAR</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {faqs.length === 0 ? (
        <div className="bg-[#E6DAB9] rounded-lg shadow p-6 text-center text-[#084C4C]">No hay preguntas frecuentes.</div>
      ) : (
        <div className="space-y-4">
          {faqs.map((faq) => (
            <div key={faq.id} className="bg-[#E6DAB9] rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="font-display tracking-wider text-[#084C4C]">{faq.question}</h3>
                  <p className="text-sm text-[#084C4C]/70 mt-1">{faq.answer}</p>
                  <p className="text-xs text-[#084C4C]/50 mt-1">Orden: {faq.order}</p>
                </div>
                <div className="flex items-center gap-2 ml-4">
                  <button onClick={() => toggleActive(faq)} className={`px-2 py-1 text-xs rounded-full ${faq.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {faq.isActive ? 'ACTIVO' : 'INACTIVO'}
                  </button>
                  <button onClick={() => openEdit(faq)} className="text-indigo-600 hover:text-indigo-900 text-sm">Editar</button>
                  <button onClick={() => handleDelete(faq.id)} className="text-red-600 hover:text-red-900 text-sm">Eliminar</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
