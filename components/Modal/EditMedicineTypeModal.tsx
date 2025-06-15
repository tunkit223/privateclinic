'use client'

import React from 'react'
import EditMedicineTypeForm from '../forms/EditForms/EditMedicineTypeForm'

export default function EditMedicineTypeModal({
  initialData,
  isOpen,
  onSave,
  onClose,
}: {
  initialData: any
  isOpen: boolean
  onSave: (updateMedicine: any) => void
  onClose: () => void
}) {
  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-40 z-40 flex items-center justify-center"
      onClick={onClose}
    >
      <div
        className="bg-blue-100 rounded-lg shadow-lg max-w-lg w-full p-6 relative z-50"
        onClick={(e) => e.stopPropagation()} >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-600 hover:text-gray-900"
        >
          ✕
        </button>

        <EditMedicineTypeForm
          initialData={initialData}
          onSave={onSave}
        />
      </div>
    </div>
  )
}
