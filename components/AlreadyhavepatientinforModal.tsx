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
import Link from "next/link"
import AlreadyhavepatientinforForm from "./forms/AlreadyhavepatientinforForm"

const AlreadyhavepatientinforModal = ({
 
}:{
 
}) => {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
    <DialogTrigger asChild>
     <p className="text-green-500 cursor-pointer font-bold hover:text-green-200">Already have patient information</p>
    </DialogTrigger>
    <DialogContent className="shad-dialog sm:max-w-[900px]">
      <DialogHeader className="">
        <DialogTitle className=""></DialogTitle>
        <DialogDescription>
         
        </DialogDescription>
      </DialogHeader>
     <AlreadyhavepatientinforForm/>
    </DialogContent>
  </Dialog>
  
  )
}

export default AlreadyhavepatientinforModal