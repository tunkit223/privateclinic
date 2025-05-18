"use client"
import React from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useState } from "react"
import { Button } from "./ui/button"
import AppointmentForm from "./forms/AppointmentForm"
import { IAppointment } from "@/database/appointment.model"
import MedicalReportForm from "./forms/MedicalReportForm"
import Image from "next/image"

const MedicalReportModal = ({
  appointmentId,
  meidcalReportId,
}:{
  appointmentId: string,
  meidcalReportId: string
}) => {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
    <DialogTrigger asChild>
     <Image
      src="/assets/icons/details.png"
      alt="details"
      height={24}
      width={24}
      className="object-contain cursor-pointer"
    />
    </DialogTrigger>
    <DialogContent className="shad-dialog sm:max-w-[900px]">
      <DialogHeader className="">
        <DialogTitle className=""></DialogTitle>
        <DialogDescription>
         
        </DialogDescription>
      </DialogHeader>
     <MedicalReportForm
        appointmentId={appointmentId}
        medicalReportIds={meidcalReportId}
     />
    </DialogContent>
  </Dialog>
  
  )
}

export default MedicalReportModal