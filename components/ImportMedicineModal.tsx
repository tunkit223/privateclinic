'use client'

import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import * as XLSX from 'xlsx'
import { toast } from 'react-hot-toast'
import { getMedicineBatches, importMedicineBatchesFromExcel } from '@/lib/actions/medicineBatch.action'
import { ExcelRow } from '@/components/Types/excel'
import { useRouter } from "next/navigation"

interface Props {
  onSuccess?: () => void
}

const ImportMedicineModal = ({ onSuccess }: Props) => {
  const [loading, setLoading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const router = useRouter()

  const handleButtonClick = () => {
    fileInputRef.current?.click()
  }

  

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      setLoading(true)

      const data = await file.arrayBuffer()
      const workbook = XLSX.read(data, { type: 'array' })
      const sheet = workbook.Sheets[workbook.SheetNames[0]]
      const json = XLSX.utils.sheet_to_json<ExcelRow>(sheet)
      const typedJson = (json as Partial<ExcelRow>[]).filter(
        (row): row is ExcelRow =>
          typeof row.medicineName === 'string' &&
          typeof row.importQuantity === 'number'
      )

      if (!typedJson.length) {
        toast.error('Không có dòng hợp lệ trong file Excel!')
        return
      }

      const res = await importMedicineBatchesFromExcel(typedJson)

      if (res.success) {
        toast.success(res.message || 'Import thành công!')
        router.refresh()
        
      } else {
        toast.error(res.message || 'Import thất bại!')
      }
    } catch (err) {
      console.error(err)
      toast.error('Lỗi khi xử lý file!')
    } finally {
      setLoading(false)
      e.target.value = '' // Cho chọn lại cùng 1 file
    }
  }

  return (
    <div>
      {/* Nút bấm gọi chọn file Excel */}
      <Button className="bg-blue-400 hover:bg-blue-700 text-balck"
      variant="outline" disabled={loading} onClick={handleButtonClick}>
        {loading ? 'Đang xử lý...' : 'Import từ Excel'}
      </Button>

      {/* Ô chọn file ẩn, chỉ hiện khi bấm nút trên */}
      <input
        type="file"
        accept=".xlsx"
        ref={fileInputRef}
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />
    </div>
  )
}

export default ImportMedicineModal
