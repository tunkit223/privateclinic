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
import AddMedicineTypeForm from "./forms/AddMedicineTypeForm"
const NewMedicineTypeModal = ({}:{}) => {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
    <DialogTrigger asChild>
      <Button variant='ghost' className={`capitalize bg-blue-400`}>
        Add medicine type
      </Button>
    </DialogTrigger>
    <DialogContent className="shad-dialog sm:max-w-[550px]">
      <DialogHeader className="mb-4 space-y-1">
              <DialogTitle ></DialogTitle>
              <DialogDescription>
              </DialogDescription>
            </DialogHeader>
      <AddMedicineTypeForm/>
    </DialogContent>
  </Dialog>
  
  )
}

export default NewMedicineTypeModal