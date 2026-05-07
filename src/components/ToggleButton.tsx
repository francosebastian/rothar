'use client'

interface ToggleButtonProps {
  targetId: string
  label: string
}

export function ToggleButton({ targetId, label }: ToggleButtonProps) {
  return (
    <button
      onClick={() => document.getElementById(targetId)?.classList.toggle('hidden')}
      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
    >
      {label}
    </button>
  )
}
