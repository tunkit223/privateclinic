'use client'
import { getExamHistoryByPatientId } from '@/lib/actions/medicalReport.action'
import React, { useEffect, useState } from 'react'

const ExamHistoryForm = ({patientId}:{patientId:string}) => {
   const [reports, setReports] = useState<any[]>([])

  useEffect(() => {
    const fetchData = async () => {
      const data = await getExamHistoryByPatientId(patientId)
      setReports(data)
    }

    fetchData()
  }, [patientId])
  return (
     <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Examination History</h2>
      <table className="table-auto border border-collapse w-full">
        <thead>
          <tr className="bg-blue-300 text-black">
            <th className="border px-2 py-1">ID</th>
            <th className="border px-2 py-1">Name</th>
            <th className="border px-2 py-1">Date</th>
            <th className="border px-2 py-1">Symptom</th>
            <th className="border px-2 py-1">Disease Type</th>
          </tr>
        </thead>
        <tbody>
          {reports.map((report, index) => (
            <tr key={report._id}>
              <td className="border px-2 py-1 text-center">{index + 1}</td>
              <td className="border px-2 py-1">{report.appointmentId.patientId.name}</td>
              <td className="border px-2 py-1 text-center">
                {new Date(report.appointmentId.date).toLocaleString('vi-VN', {
                  hour: '2-digit',
                  minute: '2-digit',
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                  hour12: false
                })}
              </td>
              <td className="border px-2 py-1">{report.symptom || '-'}</td>
              <td className="border px-2 py-1">{report.diseaseType || '-'}</td>
            </tr>
          ))}
          {reports.length === 0 && (
            <tr>
              <td colSpan={5} className="border text-center py-2">No data</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

export default ExamHistoryForm