// app/[accountId]/Invoice/page.tsx
"use client"

import { useEffect, useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "antd"
import { FaPlus } from "react-icons/fa"
import { useRouter, useParams } from "next/navigation"
import { InvoiceDataTable } from "@/components/table/InvoiceTable/InvoiceDataTable"
import { IInvoice } from "@/database/invoice.model"
import { getBillList } from "@/lib/actions/invoice.action"
import { invoiceColumns } from "@/components/table/InvoiceTable/invoiceColumns"

interface InvoiceData {
  documents: IInvoice[];
}

function InvoicePage() {
  const [Invoices, setInvoices] = useState<InvoiceData>({ documents: [] })
  const [filterValue, setFilterValue] = useState("")
  const router = useRouter()
  const params = useParams()

  const fetchInvoices = async () => {
    // try {
    //   const response = await getInvoiceList()
    //   setInvoices(response)
    // } catch (err) {
    //   console.log("Failed to fetch Invoices", err)
    // }
  }

  // useEffect(() => {
  //   fetchInvoices()
  // }, [])

  const handleAddInvoice = () => {
    const accountId = params?.accountId
    router.push(`/${accountId}/Invoice/create`)
  }

  return (
    <>
      <div className="header flex justify-between items-center">
        <Input
          placeholder="Search by patient..."
          value={filterValue}
          onChange={(e) => setFilterValue(e.target.value)}
          className="w-full max-w-[500px] font-medium text-xl py-5 border border-dark-200 rounded-lg mb-3"
        />
        <Button
          style={{
            backgroundColor: "#4EC092",
            color: "#fff",
            fontSize: "15px",
            fontWeight: "600",
          }}
          onClick={handleAddInvoice}
          icon={<FaPlus />}
        >
          Create Invoice
        </Button>
      </div>
      <InvoiceDataTable
        globalFilter={filterValue}
        columns={invoiceColumns({ onDeleted: fetchInvoices, onUpdated: fetchInvoices })}
        data={Invoices.documents.reverse()}
      />
    </>
  )
}

export default InvoicePage
