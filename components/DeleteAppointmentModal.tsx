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
import { Delete, Trash2 } from "lucide-react"
import DeleteAppointmentForm from "./forms/DeleteAppointmentForm"
const DeleteAppointmentModal = ({
  appointmentId,
  disabled = false,
}:{
 appointmentId:string,
  disabled?: boolean
}) => {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
    <DialogTrigger asChild>
          <Button
          className="ml-3 bg-red-500 hover:bg-red-700 text-white"
          size="sm"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
              
    </DialogTrigger>
    <DialogContent className="shad-dialog max-w-[900px]">
      <DialogHeader className="">
        <DialogTitle className=""></DialogTitle>
        <DialogDescription>
         
        </DialogDescription>
      </DialogHeader>
     <DeleteAppointmentForm
      appointmentId={appointmentId}
     />
    </DialogContent>
  </Dialog>
  
  )
}

export default DeleteAppointmentModal