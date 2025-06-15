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
import Image from "next/image"
import AddMedicineForm from "./forms/AddMedicineForm"
import MedicineMonthlyReportForm from "./forms/MedicineMonthlyReportForm"
const MedicineMonthlyReportModal = ({}:{}) => {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
    <DialogTrigger asChild>
      <Button variant='ghost' className={`capitalize bg-blue-400`}>
        Export Report
      </Button>
    </DialogTrigger>
    <DialogContent className="shad-dialog sm:max-w-[800px]">
      <DialogHeader className="mb-4 space-y-1">
              <DialogTitle ></DialogTitle>
              <DialogDescription>
              </DialogDescription>
            </DialogHeader>
      <MedicineMonthlyReportForm/>
    </DialogContent>
  </Dialog>
  
  )
}

export default MedicineMonthlyReportModal