"use client"

import { ColumnDef } from "@tanstack/react-table"
import StatusBadge from "../StatusBadge"
import { formatDateTime } from "@/lib/utils"
import { Doctors } from "@/constants"
import Image from "next/image"
import AppointmentModal from "../AppointmentModal"
import { IAppointment, IAppointmentDoc } from "@/database/appointment.model"
import MedicalReportModal from "../MedicalReportModal"
import DetailsAppointmentModal from "../DetailsAppointmentModal"
import { Button } from "../ui/button"
import { ConfirmAppointment } from "@/lib/actions/appointment.action"
import { useRouter } from "next/navigation"
import { useState } from "react"
import toast from "react-hot-toast"
import { getDoctorInfo } from "@/lib/actions/workschedules.action"
import DoctorCell from "../Doctorcell"



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
    accessorKey: "doctor",
    header: () => "Doctor",
    cell: ({ row }) => <DoctorCell doctorId={row.original.doctor.toString()} />,
},
  {
    id: "actions",
    header: () => <div className="pl-4">Actions</div>,
    cell: ({ row }) => {
      const patient = row.original.patientId;
      const patientId = typeof patient === "object" ? patient._id : "Unknown"; 
      const router = useRouter();
       const [isLoading, setIsLoading] = useState(false);

      const handleConfirm = async () => {
        setIsLoading(true); 
        try {
          const res = await ConfirmAppointment({
            appointmentId: row.original._id.toString(),
          });

          if (!res?.error) {
            router.refresh(); 
             toast.success("Confirm appointment successfully.", {
            position: "top-left",
            duration: 3000,
        });
          } else {
             toast.error("Cannot confirm appointment.", {
            position: "top-left",
            duration: 3000,
           });
          }
        } catch (error) {
          console.error("Lỗi khi xác nhận", error);
        } finally {
          setIsLoading(false); 
        }
      };
      return(
        
        <div className="flex gap-1">
            {/* <MedicalReportModal
             type="finish"
             appointmentId={row.original._id.toString()}
             /> */}
              <Button
                variant="ghost"
                className="capitalize text-green-500"
                onClick={handleConfirm}
                disabled={isLoading}
              >
                {isLoading ? "Loading..." : "Confirm"}
              </Button>
             <AppointmentModal 
             type="cancel"
             patientId={patientId.toString()}
             appointment={row.original}
             />
             <DetailsAppointmentModal
               appointmentId={row.original._id.toString()}
             />
        </div>
      )
    },
  },
]
