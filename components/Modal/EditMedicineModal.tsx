'use client'

import React from 'react';
import EditMedicineForm from '../forms/EditForms/EditMedicineForm'

export default function EditMedicineModal({
    initialData,
    isOpen,
    onSave,
    onClose,
    medicineTypes,  
}: {
    initialData: any,
    isOpen: boolean,
    onSave: (updateMedicine: any) => void,
    onClose: () => void,
    medicineTypes: { _id: string; name: string }[]  
}) {
    if (!isOpen) return null;

    return (
        <>
          <div className="fixed inset-0 bg-black bg-opacity-40 z-40" onClick={onClose} />
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <div className="bg-blue-100 rounded-lg shadow-lg max-w-lg w-full p-6 relative">
              <button
                onClick={onClose}
                className="absolute top-3 right-3 text-gray-600 hover:text-gray-900"
              >
                ✕
              </button>

              <EditMedicineForm initialData={initialData} onSave={onSave} medicineTypes={medicineTypes} />
            </div>
          </div>
        </>
    )
}
