'use client'

import { useState } from "react"
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog"
import { Button } from "./ui/button"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { addMedicineBatch } from "@/lib/actions/medicineBatch.action"
import { useRouter } from "next/navigation"

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
    console.log("Form data gửi lên:", data)
    const result = await addMedicineBatch(data)
    console.log("Kết quả trả về từ API:", result)
    if (result.success) {
      alert("Thêm lô thuốc thành công!")
      form.reset(defaultValues)       // ✅ reset dữ liệu
      setOpen(false)
      router.refresh()
    } else {
      alert("Thêm thất bại.")
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-green-400 hover:bg-green-700 text-black">Nhập thủ công</Button>
      </DialogTrigger>
      <DialogContent className="p-6 space-y-4 max-w-lg">
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <select {...form.register("medicineId")} className="w-full border p-2 rounded">
            <option value="">Chọn thuốc</option>
            {medicines.map(m => (
              <option key={m._id} value={m._id}>{m.name}</option>
            ))}
          </select>
          <input type="number" {...form.register("importQuantity")} placeholder="Số lượng" className="w-full border p-2 rounded" />
          <select {...form.register("unit")} className="w-full border p-2 rounded">
            <option value="Jar">Jar</option>
            <option value="Tablet">Tablet</option>
          </select>
          <input type="date" {...form.register("importDate")} className="w-full border p-2 rounded" />
          <input type="date" {...form.register("expiryDate")} className="w-full border p-2 rounded" />
          <textarea {...form.register("note")} placeholder="Ghi chú (nếu có)" className="w-full border p-2 rounded" />
          <Button type="submit" className="bg-green-600 text-white w-full">Lưu</Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default NewMedicineBatchModal
