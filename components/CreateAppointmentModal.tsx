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
import Image from "next/image"
import { Types } from "mongoose"
import { IAppointment } from "@/database/appointment.model"
import DetailsAppointmentForm from "./forms/DetailsAppointmentForm"
import { Button } from "./ui/button"
import CreateAppointmentForm from "./forms/CreateAppointmentForm"
const CreateAppointmentModal = ({
  
}:{

}) => {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
    <DialogTrigger asChild>
       <Button variant='ghost' className={`capitalize bg-blue-400 p-5`}>
        Create Appointment
      </Button>
              
    </DialogTrigger>
    <DialogContent className="shad-dialog max-w-[900px]">
      <DialogHeader className="">
        <DialogTitle className=""></DialogTitle>
        <DialogDescription>
         
        </DialogDescription>
      </DialogHeader>
      <CreateAppointmentForm
         onSuccess={() => setOpen(false)}
      />
    </DialogContent>
  </Dialog>
  
  )
}

export default CreateAppointmentModal