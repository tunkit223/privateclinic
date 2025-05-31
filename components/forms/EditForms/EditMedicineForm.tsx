'use client'

import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select } from '@/components/ui/select'
import { medicineFormSchema } from '@/lib/validation'
import { updateMedicine } from '@/lib/actions/medicine.action'
import { getMedicineTypeList } from '@/lib/actions/medicineType.action'
import toast from 'react-hot-toast'
import { Unit } from '@/constants'

type MedicineFormData = z.infer<typeof medicineFormSchema>

export default function EditMedicineForm({
  initialData,
  onSave,
  medicineTypes, // <--- thêm dòng này
}: {
  initialData: {
    _id: string
    name: string
    unit: string
    medicineTypeId: string
    amount: string
    price: string
  },
  onSave: Function,
  medicineTypes: { _id: string; name: string }[] // <--- thêm dòng này
}) {
  const form = useForm<MedicineFormData>({
    resolver: zodResolver(medicineFormSchema),
    defaultValues: {
      name: initialData.name,
      medicineTypeId: initialData.medicineTypeId,
      unit: initialData.unit,
      amount: initialData.amount.toString(),
      price: initialData.price.toString(),
    },
  })

  const onSubmit = async (data: MedicineFormData) => {
    try {
      const payload = {
        ...data,
        amount: Number(data.amount),
        price: Number(data.price),
      }
      const result = await updateMedicine(initialData._id, payload)
      if (result.success) {
        toast.success('Medicine updated successfully')
        onSave(result.updateMedicine)
      } else {
        toast.error(result.message || 'Update failed')
      }
    } catch (error) {
      console.error(error)
      toast.error('An error occurred')
    }
  }

  return (
    <div className="w-full bg-black/50 flex items-center justify-center z-50">
    <div className="p-6 bg-blue-50  w-full">
  <h2 className="text-2xl font-bold mb-1">Edit medicine</h2>
  <p className="text-sm text-gray-500 mb-4">Fill in the details</p>

  <form onSubmit={form.handleSubmit(onSubmit)} >
    {/* Name */}
    <div className="mb-4">
      <label className="block font-medium mb-1" htmlFor="name">Name</label>
      <input
        id="name"
        {...form.register("name")}
        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring"
        placeholder="Enter medicine"
      />
    </div>

    {/* Medicine Type */}
    <div className="mb-4">
      <label className="block font-medium mb-1" htmlFor="medicineTypeId">Medicine Type</label>
      <select
        id="medicineTypeId"
        {...form.register("medicineTypeId")}
        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring"
      >
        <option value="">Select a tag</option>
        {medicineTypes.map((type) => (
          <option key={type._id} value={type._id}>{type.name}</option>
        ))}
      </select>
    </div>

    {/* Unit */}
    <div className="mb-4">
      <label className="block font-medium mb-1" htmlFor="unit">Unit</label>
      <select
        id="unit"
        {...form.register("unit")}
        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring"
      >
        <option value="">Select a tag</option>
        <option value="Jar">Jar</option>
        <option value="Tablet">Tablet</option>
      </select>
    </div>

    {/* Amount */}
    <div className="mb-4">
      <label className="block font-medium mb-1" htmlFor="amount">Amount</label>
      <input
        id="amount"
        type="number"
        {...form.register("amount")}
        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring"
        placeholder="Enter amount"
      />
    </div>

    {/* Price */}
    <div className="mb-6">
      <label className="block font-medium mb-1" htmlFor="price">Price</label>
      <input
        id="price"
        type="number"
        {...form.register("price")}
        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring"
        placeholder="Enter price"
      />
    </div>

    <button
      type="submit"
      className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md"
    >
      Save Changes
    </button>
  </form>
</div>
</div>
  )
}
