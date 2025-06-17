"use client"
import React, { useEffect } from "react"
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
import { useParams } from "next/navigation"
import { getUserByAccountId } from "@/lib/actions/user.action"
const NewemployeeModal = ({}:{}) => {
  const [open, setOpen] = useState(false)
  const [isadmin, setIsAdmin] = useState(false);
  const params = useParams();

    const fetchUserRole = async () => {
    try {
      const user = await getUserByAccountId(params?.accountId as string);
      if (user?.role === "admin") {
        setIsAdmin(true);
      }
    } catch (err) {
      console.error("Lỗi khi fetch user:", err);
    }}
    useEffect(() => {
      fetchUserRole();
    }, []);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
    <DialogTrigger asChild>
      <Button variant='ghost' disabled={!isadmin} className={`capitalize bg-blue-400 p-5`}>
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