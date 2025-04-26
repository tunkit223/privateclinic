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
import CreateEmployeeForm from "./forms/CreateEmployeeForm"
const NewemployeeModal = ({}:{}) => {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
    <DialogTrigger asChild>
      <Button variant='ghost' className={`capitalize bg-blue-400`}>
                <Image
                  src="/assets/images/user-plus.png"
                  height={24}
                  width={24}
                  alt="userplus"
                />
        Add employee
      </Button>
    </DialogTrigger>
    <DialogContent className="shad-dialog sm:max-w-[550px]">
      <DialogHeader className="mb-4 space-y-1">
              <DialogTitle ></DialogTitle>
              <DialogDescription>
              </DialogDescription>
            </DialogHeader>
      <CreateEmployeeForm/>
    </DialogContent>
  </Dialog>
  
  )
}

export default NewemployeeModal