// components/table/BillTable/billColumns.tsx
"use client"

import { ColumnDef } from "@tanstack/react-table"
import { IInvoice } from "@/database/invoice.model"
import { Button } from "antd"
import { ViewIcon } from "lucide-react"
import dayjs from "dayjs"
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
    header: "ID",
    accessorFn: (row) => {
      return row.code
    },
    cell: ({ row }) => {
      return <p className="text-14-medium">{row.original.code}</p>;
    }
  },
  {
    accessorKey: "patient",
    header: "Patient name",
    accessorFn: (row) => {
      return row.medicalReportId?.appointmentId?.patientId?.name || "N/A";
    },
    cell: ({ row }) => {
      return <p className="text-14-medium">{row.original.medicalReportId?.appointmentId?.patientId?.name || "N/A"}</p>;
    },
  },
  {
    accessorKey: "examinationDate",
    header: "Examination Date",
    accessorFn: (row) => {
      return row.medicalReportId?.examinationDate || "N/A";
    },
    cell: ({ row }) => {
      const date = row.original.medicalReportId?.examinationDate;
      const formatDate = date ? dayjs(date).format("DD/MM/YYYY") : "N/A"
      return <p className="text-14-medium">{formatDate}</p>;
    },
  },
  {
    accessorKey: "totalAmount",
    header: "Total Amount ($)",
    accessorFn: (row) => {
      return row.totalAmount || "N/A";
    },
    cell: ({ row }) => {
      return <p className="text-14-medium">{row.original.totalAmount || "N/A"}</p>;
    },
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
