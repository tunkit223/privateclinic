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
const DetailsAppointmentModal = ({
  appointmentId
}:{
 appointmentId:string
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
    <DialogContent className="shad-dialog max-w-[900px]">
      <DialogHeader className="">
        <DialogTitle className=""></DialogTitle>
        <DialogDescription>
         
        </DialogDescription>
      </DialogHeader>
      <DetailsAppointmentForm
         appointmentId={appointmentId}
         onSuccess={() => setOpen(false)}
      />
    </DialogContent>
  </Dialog>
  
  )
}

export default DetailsAppointmentModal