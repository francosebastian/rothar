'use client'

export function ToggleButton() {
  return (
    <button
      onClick={() => document.getElementById('product-form')?.classList.toggle('hidden')}
      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
    >
      Agregar Producto
    </button>
  )
}
