"use client"

import { useEffect, useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "antd"
import { FaPlus } from "react-icons/fa"
import { useRouter, useParams } from "next/navigation"
import { InvoiceDataTable } from "@/components/table/InvoiceTable/InvoiceDataTable"
import { IInvoice } from "@/database/invoice.model"
import { invoiceColumns } from "@/components/table/InvoiceTable/invoiceColumns"
import { getInvoiceList } from "@/lib/actions/invoice.action"

interface InvoiceData {
  documents: IInvoice[];
}

function InvoicePage() {
  const [invoiceList, setInvoiceList] = useState<InvoiceData>({ documents: [] })
  const [filterValue, setFilterValue] = useState("")


  const fetchInvoice = async () => {
    try {
      const response = await fetch("/api/invoices");
      if (!response) {
        console.log("Not response invoice")
        return;
      }
      const data = await response.json();
      setInvoiceList(data);

    } catch (error) {
      console.log("Failed to fetch invoice", error)
    }
  }
  useEffect(() => {
    fetchInvoice();
  }, [])
  console.log("Invoice list: ", invoiceList)


  return (
    <>
      <div className="header flex justify-between items-center">
        <Input
          placeholder="Search by patient..."
          value={filterValue}
          onChange={(e) => setFilterValue(e.target.value)}
          className="w-full max-w-[500px] font-medium text-xl py-5 border border-dark-200 rounded-lg mb-3"
        />
      </div>
      <InvoiceDataTable
        globalFilter={filterValue}
        columns={invoiceColumns({ onDeleted: fetchInvoice, onUpdated: fetchInvoice })}
        data={invoiceList.documents.reverse()}
      />
    </>
  )
}

export default InvoicePage
