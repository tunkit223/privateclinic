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


const MedicalReportModal = ({
  type,
  appointmentId,
}:{
  type:'finish'
  appointmentId: string
}) => {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
    <DialogTrigger asChild>
      <Button variant='ghost' className={`capitalize ${type==='finish'&&'text-green-500'}`}>
        {type}
      </Button>
    </DialogTrigger>
    <DialogContent className="shad-dialog sm:max-w-[900px]">
      <DialogHeader className="mb-4 space-y-3">
        <DialogTitle className="capitalize">{type} Appointment</DialogTitle>
        <DialogDescription>
          Please fill in the following details to {type} an appointment
        </DialogDescription>
      </DialogHeader>
     <MedicalReportForm
        appointmentId={appointmentId}
     />
    </DialogContent>
  </Dialog>
  
  )
}

export default MedicalReportModal