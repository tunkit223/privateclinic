"use client"

import { ColumnDef } from "@tanstack/react-table"
import StatusBadge from "../StatusBadge"
import { formatDateTime } from "@/lib/utils"
import { Doctors } from "@/constants"
import Image from "next/image"
import AppointmentModal from "../AppointmentModal"
import { IAppointment, IAppointmentDoc } from "@/database/appointment.model"
import MedicalReportModal from "../MedicalReportModal"


export const columns: ColumnDef<IAppointmentDoc>[] = [
  {
    header: "ID",
    cell: ({row}) => <p className="text-14-medium">{row.index+1}</p>
  },
  {
    accessorKey: "patient",
    header: "Patient",
    accessorFn: (row) => {
      return typeof row.patientId === "object" ? row.patientId.name : "";
    },
    cell: ({ row }) => {
      const patient = row.original.patientId;
      const patientName = typeof patient === "object" ? patient.name : "Unknown";
      return <p className="text-14-medium">{patientName}</p>;
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({row}) =>{
      return(
      <div className="min-w-[115px]">
        <StatusBadge status={row.original.status}/>
      </div>)
    }
  },
  {
    accessorKey: "schedule",
    header: "Appointment",
    cell:({row}) =>(
      <p className="text-14-regular min-w-[100px]">
        {formatDateTime(row.original.date).dateTime}
      </p>
    )
  },
  {
    accessorKey: "primaryPhysician",
    header: () => 'Doctor',
    cell: ({ row }) => {
      const doctor = Doctors.find((doc)=> doc.name === row.original.doctor)
      return (
        <div className="flex items-center gap-3">
          <Image
            src={doctor!.image}
            alt={doctor!.name}
            width={100}
            height={100}
            className='size-8'
          />
          <p className="whitespace-nowrap">
              Dr. {doctor?.name}
          </p>
        </div>
      )
    },
  },
  {
    id: "actions",
    header: () => <div className="pl-4">Actions</div>,
    cell: ({ row }) => {
      const patient = row.original.patientId;
      const patientId = typeof patient === "object" ? patient._id : "Unknown"; 
      return(
        
        <div className="flex gap-1">
            <MedicalReportModal
             type="finish"
             appointmentId={row.original._id.toString()}
             />
             <AppointmentModal 
             type="cancel"
             patientId={patientId}
             appointment={row.original}
            
             />
        </div>
      )
    },
  },
]
