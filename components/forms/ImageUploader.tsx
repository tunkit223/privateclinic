'use client'

import React, { useState } from 'react'
import toast from 'react-hot-toast'

interface ImageUploaderProps {
  onUploadComplete: (url: string) => void
}

export default function ImageUploader({ onUploadComplete }: ImageUploaderProps) {
  const [loading, setLoading] = useState(false)

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Kiểm tra loại file
    const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/svg+xml']
    if (!allowedTypes.includes(file.type)) {
      toast.error('Chỉ hỗ trợ file PNG, JPG, JPEG, SVG'), {
          position: "top-left",
          duration: 3000,
        }
      return
    }

    setLoading(true)
    const formData = new FormData()
    formData.append('file', file)

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (!res.ok) throw new Error('Upload failed')

      const data = await res.json()
      onUploadComplete(data.url) // gửi url về cho parent
    } catch (error) {
      console.error(error)
      alert('Upload ảnh thất bại')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      {/* Giới hạn file có đuôi png, jpg, jpeg, svg */}
      <input
        type="file"
        accept=".png,.jpg,.jpeg,.svg"
        onChange={handleUpload}
      />
      {loading && <p>Đang tải ảnh lên...</p>}
    </div>
  )
}
