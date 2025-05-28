"use client"

import { ColumnDef } from "@tanstack/react-table"
import Prescription, { IPrescription } from "@/database/prescription.model";
import { Button } from "antd";
import { useState } from "react";
import PrescriptionStatusButton from "@/components/Button/PrescriptionStatusButton";
import ViewPrescriptionDetails from "./ViewPrescriptionDetails";
import { Delete, Edit } from "lucide-react";
import EditPrescriptionDetails from "./EditPrescriptionDetails";
import DeletePrescriptionDetails from "./DeletePrescription";


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
      return <p className="text-14-medium">{row.original.totalPrice || "N/A"}</p>;
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
          prescriptionId={row.original._id.toString()} />
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
            <EditPrescriptionDetails prescriptionId={row.original._id.toString()} />
            <DeletePrescriptionDetails />
          </div>
        </>
      )
    }
  },
]
