'use client'

import { useState } from 'react'
import { UploadClient } from '@uploadcare/upload-client'

const uploadClient = new UploadClient({
  publicKey: process.env.NEXT_PUBLIC_UPLOADCARE_PUBLIC_KEY!,
})

interface ImageUploadProps {
  value: string
  onChange: (url: string) => void
}

export function ImageUpload({ value, onChange }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    try {
      const result = await uploadClient.uploadFile(file)
      
      // Uploadcare returns: https://subdomain.ucarecd.net/UUID/filename
      console.log('Uploadcare result:', result)
      console.log('CDN URL from result:', result.cdnUrl)
      
      // Simple solution: construct URL manually with correct format
      // Correct format: https://goc9lmmt47.ucarecd.net/UUID/filename
      const finalUrl = `https://goc9lmmt47.ucarecd.net/${result.uuid}/${file.name}`
      
      console.log('Final URL to save:', finalUrl)
      onChange(finalUrl)
    } catch (error) {
      console.error('Upload error:', error)
      alert('Error al subir la imagen')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-4">
        <input
          type="text"
          name="image"
          required
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          placeholder="URL de la imagen"
        />
        <label className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
          {uploading ? 'Subiendo...' : 'Subir Imagen'}
          <input
            type="file"
            accept="image/*"
            onChange={handleUpload}
            disabled={uploading}
            className="hidden"
          />
        </label>
      </div>
      {value && (
        <div className="mt-2 relative h-32 w-32">
          <img
            src={value}
            alt="Preview"
            className="h-full w-full object-cover rounded-md"
          />
        </div>
      )}
    </div>
  )
}
