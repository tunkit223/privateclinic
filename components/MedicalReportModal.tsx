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
const MedicalReportModal = ({
  type,
  patientId,
  appointment,
}:{
  type:'finish'
  patientId: string,
  appointment?:IAppointment,
}) => {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
    <DialogTrigger asChild>
      <Button variant='ghost' className={`capitalize ${type==='finish'&&'text-green-500'}`}>
        {type}
      </Button>
    </DialogTrigger>
    <DialogContent className="shad-dialog sm:max-w-md">
      <DialogHeader className="mb-4 space-y-3">
        <DialogTitle className="capitalize">{type} Appointment</DialogTitle>
        <DialogDescription>
          Please fill in the following details to {type} an appointment
        </DialogDescription>
      </DialogHeader>
      <AppointmentForm
        patientId={patientId}
        type={type}
        appointment={appointment}
        setOpen={setOpen}
      />
    </DialogContent>
  </Dialog>
  
  )
}

export default MedicalReportModal