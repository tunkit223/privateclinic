// File: components/EditMedicineTypeServer.tsx

'use client'

import { updateMedicineType } from '@/lib/actions/medicineType.action'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function EditMedicineTypeServer({
  initialData,
  onSave,
}: {
  initialData: any
  onSave: Function
}) {
  const [name, setName] = useState(initialData.name)
  const [description, setDescription] = useState(initialData.description)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Trực tiếp gọi server action sửa để cập nhật dữ liệu
    const result = await updateMedicineType(initialData._id, { name, description })

    if (result.success) {
      onSave(result.updatedMedicineType) // Call onSave để cập nhật lại dữ liệu trên UI
    } else {
      console.error(result.message)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Medicine Type Name"
      />
      <Input
        type="text"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Description"
      />
      <Button type="submit">Save Changes</Button>
    </form>
  )
}
