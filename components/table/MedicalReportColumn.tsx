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
import { IMedicalReport } from "@/database/medicalReport.modal"
import StatusBadgeMedical from "../StatusBadgeMedicalRP"
import { examiningMedicalReport, ExaminedMedicalReport } from "@/lib/actions/medicalReport.action"
import medicalreport from "@/app/[accountId]/(root)/medicalreport/page"
import DoctorCell from "../Doctorcell"
import { format } from "date-fns"
import DeleteMedicalreportModal from "../deleteMedicalreportModal"


export const columns: ColumnDef<IMedicalReport>[] = [
  {
    header: "ID",
    cell: ({ row }) => <p className="text-14-medium">{row.index + 1}</p>
  },
  {
  accessorKey: "patient",
  accessorFn: (row) =>
    typeof row.appointmentId?.patientId === "object"
      ? row.appointmentId.patientId.name
      : "",
  header: "Patient",
  cell: ({ row }) => {
    const patient = row.original.appointmentId?.patientId;
    const name = typeof patient === "object" ? patient?.name : "Unknown";
    return <p className="text-14-medium">{name}</p>;
  },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      return (
        <div className="min-w-[115px]">
          <StatusBadgeMedical status={row.original.status} />
        </div>)
    }
  },
  {
    accessorKey: "schedule",
    header: "Appointment",
     accessorFn: row => {
    const date = row.appointmentId?.date;
    return date ? format(new Date(date), "yyyy-MM-dd") : "";
  },
    cell: ({ row }) => {
      const date = row.original.appointmentId?.date;
      return (
        <p className="text-14-regular min-w-[100px]">
          {date ? formatDateTime(date).dateTime : "N/A"}
        </p>
      );
    },
  },
  {
    accessorKey: "doctor",
    header: () => "Doctor",
    cell: ({ row }) => <DoctorCell doctorId={row.original.appointmentId?.doctor.toString()} />,
  },
  {
    accessorKey: "examinationDate",
    header: () => "Examination Date",
    cell: ({ row }) => <p className="text-14-regular min-w-[100px]">
          {row.original.examinationDate ? formatDateTime(row.original.examinationDate).dateTime : "Waiting for examination"}
        </p>
  },
  {
    accessorKey: "symptom",
    header: "Symptom",
    cell: ({ row }) => {
      const symptom = row.original?.symptom;
      return (
        <p className="text-14-regular min-w-[100px]">
          {symptom}
        </p>
      );
    },
  },
  {
    accessorKey: "diseaseType",
    header: "Disease Type",
    cell: ({ row }) => {
      const diseaseType = row.original?.diseaseType;
      return (
        <p className="text-14-regular min-w-[100px]">
          {diseaseType}
        </p>
      );
    },
  },
  {
    id: "actions",
    header: () => <div className="pl-4">Actions</div>,
    cell: ({ row }) => {
      const patient = row.original.patientId;
      const patientId = typeof patient === "object" ? patient._id : "Unknown";
      const router = useRouter();
      const [isLoading, setIsLoading] = useState(false);
      const [modalOpen, setModalOpen] = useState(false);

      const handleExamining = async () => {
        setIsLoading(true);
        try {
          const res = await examiningMedicalReport({
            medicalreportId: row.original._id.toString(),
          });

          if (res) {
            router.refresh();
            toast.success("Medical report is examining.", {
              position: "top-left",
              duration: 3000,
            });
             setModalOpen(true);
          } else {
            toast.error("Cannot examining.", {
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

      const handleExamined = async () => {
        setIsLoading(true);
        try {
          const res = await ExaminedMedicalReport({
            medicalreportId: row.original._id.toString(),
          });

          if (res) {
            router.refresh();
            toast.success("Examined appointment successfully.", {
              position: "top-left",
              duration: 3000,
            });
          } else {
            toast.error("Cannot Examined appointment.", {
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
     const disableExamining = isLoading || row.original.status === "examining" || row.original.status === "examined";
      const disableExamined = isLoading || row.original.status === "unexamined" || row.original.status === "examined";
      const isExamining = row.original.status === "examining";
      return (

        <div className="flex gap-1">
           
              <Button
                variant="ghost"
                className="capitalize text-blue-500"
                onClick={handleExamining}
                disabled={isLoading||disableExamining}
                
              >
                {isLoading ? "Loading..." : "examining"}
              </Button>
              
              
              <Button
                variant="ghost"
                className="capitalize text-green-500"
                onClick={handleExamined}
                disabled={isLoading||disableExamined}
              >
                {isLoading ? "Loading..." : "examined"}
              </Button>


            
             <MedicalReportModal
              appointmentId={row.original.appointmentId._id.toString()}
              meidcalReportId={row.original._id.toString()}
              disabled={!isExamining}
              open={modalOpen}
              onOpenChange={setModalOpen}
            />
            <DeleteMedicalreportModal
              medicalreportId={row.original._id.toString()}
              disabled={row.original.status === "examined" || row.original.status === "examining"}
            />
        </div>
      )
    },
  },
]
