'use client'

import { useState } from "react"
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog"
import { Button } from "./ui/button"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { addMedicineBatch } from "@/lib/actions/medicineBatch.action"
import { useRouter } from "next/navigation"
import { Label } from "./ui/label"
import { Input } from "./ui/input"
import { Textarea } from "./ui/textarea"

const formSchema = z.object({
  medicineId: z.string(),
  importQuantity: z.coerce.number().min(1, { message: "Số lượng phải lớn hơn 0" }),
  unit: z.string(),
  importDate: z.string(),
  expiryDate: z.string().optional(),
  note: z.string().optional()
})

type FormData = z.infer<typeof formSchema>

interface Props {
  medicines: { _id: string, name: string, unit: string, medicineTypeId: string }[]
}

const defaultValues = {
  medicineId: '',
  importQuantity: 1,
  unit: 'Tablet',
  importDate: new Date().toISOString().slice(0, 10),
  expiryDate: '',
  note: ''
}

const NewMedicineBatchModal = ({ medicines }: Props) => {
  const [open, setOpen] = useState(false)
  const router = useRouter()
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues
  })

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      form.reset(defaultValues)
    }
    setOpen(isOpen)
  }

  const onSubmit = async (data: FormData) => {
    const result = await addMedicineBatch(data)
    if (result.success) {
      alert("Thêm lô thuốc thành công!")
      form.reset(defaultValues)
      setOpen(false)
      router.refresh()
    } else {
      alert("Thêm thất bại.")
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button className="bg-green-400 hover:bg-green-700 text-black">Nhập thủ công</Button>
      </DialogTrigger>

      <DialogContent className="bg-blue-200 rounded-2xl shadow-xl p-6 max-w-md">
        <h2 className="text-2xl font-bold mb-1">Add medicine batch</h2>
        <p className="text-gray-500 mb-4">Fill in the details</p>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* Medicine Select */}
          <div>
            <Label htmlFor="medicineId">Medicine</Label>
            <select
              {...form.register("medicineId")}
              id="medicineId"
              className="mt-1 w-full rounded-md border px-3 py-2 bg-white text-sm"
            >
              <option value="">Select medicine</option>
              {medicines.map(m => (
                <option key={m._id} value={m._id}>{m.name}</option>
              ))}
            </select>
          </div>

          {/* Import Quantity */}
          <div>
            <Label htmlFor="importQuantity">Quantity</Label>
            <Input
              type="number"
              id="importQuantity"
              {...form.register("importQuantity")}
              placeholder="Enter quantity"
            />
          </div>

          {/* Unit */}
          <div>
            <Label htmlFor="unit">Unit</Label>
            <select
              {...form.register("unit")}
              id="unit"
              className="mt-1 w-full rounded-md border px-3 py-2 bg-white text-sm"
            >
              <option value="Jar">Jar</option>
              <option value="Tablet">Tablet</option>
            </select>
          </div>

          {/* Import Date */}
          <div>
            <Label htmlFor="importDate">Import Date</Label>
            <Input
              type="date"
              id="importDate"
              {...form.register("importDate")}
            />
          </div>

          {/* Expiry Date */}
          <div>
            <Label htmlFor="expiryDate">Expiry Date</Label>
            <Input
              type="date"
              id="expiryDate"
              {...form.register("expiryDate")}
            />
          </div>

          {/* Note */}
          <div>
            <Label htmlFor="note">Note</Label>
            <Textarea
              id="note"
              {...form.register("note")}
              placeholder="Ghi chú (nếu có)"
              className="min-h-[80px]"
            />
          </div>

          {/* Submit */}
          <Button type="submit" className="bg-green-400 text-white w-full">
            Add
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default NewMedicineBatchModal
