"use client"
 // Trang đăng kí user mới
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Form, FormControl } from "@/components/ui/form"
import CustomFormField from "../CustomFormField"
import SubmitButton from "../SubmitButton"
import { useState } from "react"
import { ChangePassFormValidation } from "@/lib/validation"
import { useParams, useRouter } from "next/navigation"
import { FormFieldType } from "./PatientForm"
import { sendVerificationEmail, updatePassword, verifyCode } from "@/lib/actions/login.actions"
import toast from "react-hot-toast"
import { checkOldPassword } from "@/lib/actions/user.action"

const ChangePassWord = () => {
  const params = useParams();
  const accountId = params?.accountId as string;
  const router = useRouter();
  const [isLoading, setisLoading] = useState(false);
  
  
  const form = useForm<z.infer<typeof ChangePassFormValidation>>({
    resolver: zodResolver(ChangePassFormValidation),
    defaultValues: {
      oldpassword: "",
      newpassword:"",
      newpasswordagain:""
    },
  })
 
 
  async function onSubmit(values: z.infer<typeof ChangePassFormValidation>) {
  setisLoading(true);
  try {
    // Kiểm tra old password
    const res = await checkOldPassword(accountId, values.oldpassword);
    if (res.success=== false) {
      toast.error("Mật khẩu chưa đúng", { position: "top-left", duration: 3000 });
      setisLoading(false);
      return;
    }

    const email = res.email;

    // Gọi hàm update password
    const update = await updatePassword(email, values.newpassword);

    if (update.error) {
      toast.error(`Change password fail: ${update.error}`, {
        position: "top-left",
        duration: 3000,
      });
      setisLoading(false);
      return;
    }

    toast.success("Change password successfully.", {
      position: "top-left",
      duration: 3000,
    });
    form.reset();
  } catch (error) {
    toast.error("Error in process.", {
      position: "top-right",
      duration: 3000,
    });
  }
  setisLoading(false);
}
  
  
  return (
    <Form {...form}>
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 flex-1 w-full max-w-[500px] pt-5" >
      <p className="text-24-bold">Change password</p>
      <CustomFormField
        fieldType = {FormFieldType.INPUT}
        control = {form.control}
        name = 'oldpassword'
        label = 'Old password'
        placeholder = 'Enter your old password'
        iconSrc = '/assets/icons/key.png'
        iconAlt = 'oldpassword'/>

      <CustomFormField
        fieldType = {FormFieldType.PASSWORD}
        control = {form.control}
        name = 'newpassword'
        label= 'New password'
        placeholder = 'Enter your new password'
        iconSrc = '/assets/icons/key.png'
        iconAlt = 'newpassword'
      />

      <CustomFormField
        fieldType = {FormFieldType.PASSWORD}
        control = {form.control}
        name = 'newpasswordagain'
        label= 'New password again'
        placeholder = 'Enter your new password again'
        iconSrc = '/assets/icons/key.png'
        iconAlt = 'newpasswordagain'
      />
   
      <SubmitButton isLoading={isLoading}>Change password</SubmitButton>
    </form>
  </Form>
  )
}

export default ChangePassWord