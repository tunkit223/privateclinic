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
import { Appointment } from "@/types/appwrite.type"
import AppointmentForm from "./forms/AppointmentForm"
import { Types } from "mongoose"
import { IAppointment } from "@/database/appointment.model"
const AppointmentModal = ({
  type,
  patientId,
  appointment,
}:{
  type:'confirm' | 'cancel'
  patientId: string,
  appointment?:IAppointment,
}) => {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
    <DialogTrigger asChild>
      <Button variant='ghost' className={`capitalize ${type==='confirm'&&'text-green-500'}`}>
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

export default AppointmentModal