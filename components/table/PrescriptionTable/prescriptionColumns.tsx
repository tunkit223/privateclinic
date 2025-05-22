"use client"

import { ColumnDef } from "@tanstack/react-table"
import { IPrescription } from "@/database/prescription.model";


export const columns: ColumnDef<IPrescription>[] = [
  {
    header: "No.",
    cell: ({ row }) => <p className="text-14-medium">{row.index + 1}</p>
  },
  {
    accessorKey: "id",
    header: "ID",
    accessorFn: (row) => {
      return row.code;
    },
    cell: ({ row }) => {
      return <p className="text-14-medium">{row.original.code}</p>;
    },
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
    accessorKey: "doctor",
    header: "Doctor name",
    accessorFn: (row) => {
      return row.medicalReportId?.appointmentId?.doctor || "N/A";
    },
    cell: ({ row }) => {
      return <p className="text-14-medium">{row.original.medicalReportId?.appointmentId?.doctor || "N/A"}</p>;
    },
  },
  {
    accessorKey: "totalPrice",
    header: "Total price ($)",
    accessorFn: (row) => {
      return row.totalPrice || "N/A";
    },
    cell: ({ row }) => {
      return <p className="text-14-medium">{row.original.totalPrice || "N/A"}</p>;
    },
  },
]
