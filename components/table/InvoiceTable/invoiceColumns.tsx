// components/table/BillTable/billColumns.tsx
"use client"

import { ColumnDef } from "@tanstack/react-table"
import { IInvoice } from "@/database/invoice.model"
import { Button, Tag } from "antd"
import { ViewIcon } from "lucide-react"
import dayjs from "dayjs"
import ViewButton from "@/components/Button/ViewButton"
import EditButton from "@/components/Button/EditButton"
import DeleteInvoice from "./DeleteInvoice"
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined,
  MinusCircleOutlined,
  SyncOutlined,
} from '@ant-design/icons';
import { StatusInfo } from "@/components/Types/excel"
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
    cell: ({ row }) => {

      const status = row.original.status;
      const statusDataMap: Record<string, StatusInfo> = {
        paid: {
          color: 'success',
          icon: <CheckCircleOutlined />
        },
        pending: {
          color: 'processing',
          icon: <SyncOutlined spin />
        },
        cancelled: {
          color: 'error',
          icon: <CloseCircleOutlined />
        }
      }

      const statusData = statusDataMap[status] || { color: 'default', icon: null }
      const statusFormatted = status.charAt(0).toUpperCase() + status.slice(1);
      return (
        <>
          <Tag className="text-lg font-medium w-[120px] flex items-center justify-center" color={statusData.color} icon={statusData.icon}>{statusFormatted}</Tag>
        </>
      )
    },
  },
  {
    accessorKey: "action",
    header: "Action",
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-4">
          <ViewButton id={row.original._id.toString()} resource="invoice" />
          {row.original.status === "pending" && (
            <EditButton id={row.original._id.toString()} resource="invoice" />
          )}
          <DeleteInvoice invoiceId={row.original._id.toString()} onDeleted={onDeleted} />
        </div>
      )
    }
  }
]
