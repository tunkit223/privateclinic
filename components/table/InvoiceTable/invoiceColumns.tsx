// components/table/BillTable/billColumns.tsx
"use client"

import { ColumnDef } from "@tanstack/react-table"
import { IInvoice } from "@/database/invoice.model"
import { Button } from "antd"
import { ViewIcon } from "lucide-react"
// import ViewBillDetails from "./ViewBillDetails"
// import DownloadBillPDF from "@/components/Button/DownloadBillPDF"

interface ColumnProps {
  onUpdated: () => void;
  onDeleted: () => void;
}

export const invoiceColumns = ({ onUpdated, onDeleted }: ColumnProps): ColumnDef<IInvoice>[] => [
  {
    header: "No.",
    cell: ({ row }) => <p className="text-14-medium">{row.index + 1}</p>
  },
  {
    accessorKey: "code",
    header: "Bill ID",
  },
  {
    accessorKey: "patient",
    header: "Patient name",
  },
  {
    accessorKey: "examinationDate",
    header: "Examination Date",
  },
  {
    accessorKey: "totalAmount",
    header: "Total Amount ($)",
  },
  {
    accessorKey: "status",
    header: "Status",
  },
  {
    accessorKey: "action",
    header: "Action",
    cell: ({ row }) => (
      <div className="flex items-center gap-4">
        <Button>He</Button>
      </div>
    )
  }
]
