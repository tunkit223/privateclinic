'use client'
import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { format } from 'date-fns'
import { getMedicineUsageReport } from '@/lib/actions/medicine.action'
interface MedicineReportItem {
  name: string
  unit?: string
  totalQuantity: number
  usedCount: number
}
const MedicineMonthlyReportForm = () => {
  const [fromDate, setFromDate] = useState('')
  const [toDate, setToDate] = useState('')
   const [reportData, setReportData] = useState<MedicineReportItem[]>([])
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async() => {
    if (fromDate && toDate) {
      const result = await getMedicineUsageReport(fromDate, toDate)
      setReportData(result)
      setSubmitted(true)
    }
  }

  return (
    <div className="p-6 space-y-4">
   
      <div className="flex items-end gap-4 justify-center p-5">
        <div className='mr-5'>
          <label className="block mb-1 font-semibold">From date</label>
          <Input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} className='border-black'/>
        </div>
        <div className='mr-5'>
          <label className="block mb-1 font-semibold">To date</label>
          <Input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} className='border-black'/>
        </div>
        <Button onClick={handleSubmit} className='bg-blue-300'>Confirm</Button>
      </div>

      {submitted && (
        <div className="border border-black rounded p-4 b">
          {/* Header */}
          <div className="text-center font-bold text-xl mb-2">Medicine Report</div>
          <div className="mb-4">Time: {format(new Date(fromDate), 'dd/MM/yyyy')} - {format(new Date(toDate), 'dd/MM/yyyy')}</div>

          {/* Table */}
          <table className="w-full border border-collapse">
            <thead>
              <tr className="bg-blue-300 text-center">
                <th className="border px-2 py-1">ID</th>
                <th className="border px-2 py-1">Medicine</th>
                <th className="border px-2 py-1">Unit</th>
                <th className="border px-2 py-1">Amount</th>
                <th className="border px-2 py-1">Num of use</th>
              </tr>
            </thead>
            <tbody>
              {reportData.map((item, index) => (
                <tr key={index} className="text-center">
                  <td className="border px-2 py-1">{index + 1}</td>
                  <td className="border px-2 py-1">{item.name}</td>
                  <td className="border px-2 py-1">{item.unit || "-"}</td>
                  <td className="border px-2 py-1">{item.totalQuantity}</td>
                  <td className="border px-2 py-1">{item.usedCount}</td>
                </tr>
              ))}
              {reportData.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center py-4">No data</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}


export default MedicineMonthlyReportForm
