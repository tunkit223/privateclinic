"use client"

import { ColumnDef } from "@tanstack/react-table"
import Prescription, { IPrescription } from "@/database/prescription.model";
import { Button, Tooltip } from "antd";
import { useState } from "react";
import PrescriptionStatusButton from "@/components/Button/PrescriptionStatusButton";
import ViewPrescriptionDetails from "./ViewPrescriptionDetails";
import { Delete, Edit } from "lucide-react";
import EditPrescriptionDetails from "./EditPrescriptionDetails";
import DeletePrescriptionDetails from "./DeletePrescription";
import EditButton from "@/components/Button/EditButton";
import PrescriptionPDF from "./PrescriptionPDF";
import { RiPrinterFill } from "react-icons/ri";
import DownloadPDFButton from "@/components/Button/DownloadPDFButton";


interface ColumnProps {
  onDeleted: () => void;
  onUpdated: () => void;
}

export const columns = ({ onDeleted, onUpdated }: ColumnProps): ColumnDef<IPrescription>[] => [
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
      return row.prescribeByDoctor.name || "N/A";
    },
    cell: ({ row }) => {
      return <p className="text-14-medium">{row.original.prescribeByDoctor?.name || "N/A"}</p>;
    },
  },
  {
    accessorKey: "totalPrice",
    header: "Total price ($)",
    accessorFn: (row) => {
      return row.totalPrice || "N/A";
    },
    cell: ({ row }) => {
      return <p className="text-14-medium">{row.original.totalPrice || "0"}</p>;
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    accessorFn: (row) => {
      return row.isPaid ? "Paid" : "Unpaid";
    },
    cell: ({ row }) => {
      const isPaid = row.original.isPaid;

      return (
        <PrescriptionStatusButton
          isPaid={isPaid}
          prescriptionId={row.original._id.toString()}
          onUpdated={onUpdated} />
      )
    },
  },
  {
    accessorKey: "action",
    header: "Action",
    cell: ({ row }) => {
      return (
        <>
          <div className="flex items-center gap-4">
            <ViewPrescriptionDetails prescriptionId={row.original._id.toString()} />
            {!row.original.isPaid && (
              <EditButton id={row.original._id.toString()} resource="prescription" />
            )}
            <DeletePrescriptionDetails prescriptionId={row.original._id.toString()} onDeleted={onDeleted} />
            <DownloadPDFButton prescriptionId={row.original._id.toString()} />
          </div>
        </>
      )
    }
  },
]
