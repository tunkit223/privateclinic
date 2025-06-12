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
import ExamHistoryForm from "./forms/ExamHistoryForm"

const ExamHistoryModal = ({
  patientId
}:{
 patientId:string
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
      <ExamHistoryForm patientId={patientId}/>
    </DialogContent>
  </Dialog>
  
  )
}

export default ExamHistoryModal