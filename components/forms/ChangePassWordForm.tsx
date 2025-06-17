"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Form } from "@/components/ui/form"
import CustomFormField from "../CustomFormField"
import SubmitButton from "../SubmitButton"
import { useState } from "react"
import { ChangePassFormValidation } from "@/lib/validation"
import { useParams } from "next/navigation"
import { FormFieldType } from "./PatientForm"
import { updatePassword } from "@/lib/actions/login.actions"
import toast from "react-hot-toast"
import { checkOldPassword } from "@/lib/actions/user.action"

const ChangePassWord = () => {
  const params = useParams()
  const accountId = params?.accountId as string
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<z.infer<typeof ChangePassFormValidation>>({
    resolver: zodResolver(ChangePassFormValidation),
    defaultValues: {
      oldpassword: "",
      newpassword: "",
      newpasswordagain: "",
    },
  })

  async function onSubmit(values: z.infer<typeof ChangePassFormValidation>) {
    setIsLoading(true)
    try {
      const res = await checkOldPassword(accountId, values.oldpassword)
      if (res.success === false) {
        toast.error("Incorrect old password.", { position: "top-left", duration: 3000 })
        setIsLoading(false)
        return
      }

      const email = res.email
      const update = await updatePassword(email, values.newpassword)

      if (update.error) {
        toast.error(`Failed to change password: ${update.error}`, {
          position: "top-left",
          duration: 3000,
        })
        setIsLoading(false)
        return
      }

      toast.success("Password changed successfully.", {
        position: "top-left",
        duration: 3000,
      })
      form.reset()
    } catch (error) {
      toast.error("An error occurred while changing password.", {
        position: "top-left",
        duration: 3000,
      })
    }
    setIsLoading(false)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 flex-1 w-full pt-5">


        <CustomFormField
          fieldType={FormFieldType.INPUT}
          control={form.control}
          name="oldpassword"
          label="Old Password"
          placeholder="Enter your old password"
          iconSrc="/assets/icons/key.png"
          iconAlt="oldpassword"
        />

        <CustomFormField
          fieldType={FormFieldType.PASSWORD}
          control={form.control}
          name="newpassword"
          label="New Password"
          placeholder="Enter your new password"
          iconSrc="/assets/icons/key.png"
          iconAlt="newpassword"
        />

        <CustomFormField
          fieldType={FormFieldType.PASSWORD}
          control={form.control}
          name="newpasswordagain"
          label="Confirm New Password"
          placeholder="Enter your new password again"
          iconSrc="/assets/icons/key.png"
          iconAlt="newpasswordagain"
        />

        <SubmitButton isLoading={isLoading}>Change Password</SubmitButton>
      </form>
    </Form>
  )
}

export default ChangePassWord
