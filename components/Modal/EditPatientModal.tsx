'use client'

import React from 'react'
import EditPatientForm from '../forms/EditForms/EditPatientForm'

export default function EditPatientModal({
  initialData,
  isOpen,
  onClose,
  onSave,
}: {
  initialData: any
  isOpen: boolean
  onClose: () => void
  onSave: (updatedPatient: any) => void
}) {
  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-40 bg-black bg-opacity-40 flex items-center justify-center p-4"
      onClick={onClose} 
    >
      <div
        className="bg-blue-100 rounded-lg shadow-lg max-w-lg w-full p-6 relative z-50"
        onClick={(e) => e.stopPropagation()} 
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-600 hover:text-gray-900"
        >
          ✕
        </button>

        <EditPatientForm initialData={initialData} onSave={onSave} />
      </div>
    </div>
  )
}
