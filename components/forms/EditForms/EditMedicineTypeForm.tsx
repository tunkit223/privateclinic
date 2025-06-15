
'use client'

import { useState } from 'react'
import toast from 'react-hot-toast'

import { updateMedicineType } from '@/lib/actions/medicineType.action'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function EditMedicineTypeForm({
  initialData,
  onSave,
}: {
  initialData: { _id: string; name: string; description: string }
  onSave: (updated: any) => void
}) {
  const [name, setName] = useState(initialData.name)
  const [description, setDescription] = useState(initialData.description)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const result = await updateMedicineType(initialData._id, { name, description })

    if (result.success) {
      toast.success('Medicine type updated successfully')
      onSave(result.updatedMedicineType)
    } else {
      toast.error(result.message || 'Update failed')
    }
  }

  return (
    <div className="w-full bg-black/50 flex items-center justify-center z-50">
      <div className="p-6 bg-blue-50 w-full max-w-lg  shadow-lg">
        {/* Tiêu đề & mô tả */}
        <h2 className="text-2xl font-bold mb-1">Edit medicine type</h2>
        <p className="text-sm text-gray-500 mb-4">Fill in the details</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div>
            <label className="block font-medium mb-1" htmlFor="name">
              Name
            </label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter medicine type name"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block font-medium mb-1" htmlFor="description">
              Description
            </label>
            <Input
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter description"
            />
          </div>

          {/* Submit */}
          <Button  type="submit" className="w-full bg-blue-300 hover:bg-blue-400 text-white rounded-lg">
            Save Changes
          </Button>
        </form>
      </div>
    </div>
  )
}
