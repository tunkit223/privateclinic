"use client"
 // Trang đăng kí user mới
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Form, FormControl } from "@/components/ui/form"
import CustomFormField from "../CustomFormField"
import SubmitButton from "../SubmitButton"
import { useState } from "react"
import { ForgetPassFormValidation, VerifyEmailValidation } from "@/lib/validation"
import { useRouter } from "next/navigation"
import { FormFieldType } from "./PatientForm"
import { sendVerificationEmail, updatePassword, verifyCode } from "@/lib/actions/login.actions"
import toast from "react-hot-toast"

const ForgetPasswordForm = () => {
  const router = useRouter();
  const [isLoading, setisLoading] = useState(false);
  const [email, setEmail] = useState<string | null>(null); // Lưu email
  const form1 = useForm<z.infer<typeof VerifyEmailValidation>>({
    resolver: zodResolver(VerifyEmailValidation),
    defaultValues: {
      email:"",
    },
  })
  const form2 = useForm<z.infer<typeof ForgetPassFormValidation>>({
    resolver: zodResolver(ForgetPassFormValidation),
    defaultValues: {
      verifycode: "",
      newpassword:"",
      newpasswordagain:""
    },
  })
 
 // function đăng kí bệnh nhân
  async function onSubmit1(values: z.infer<typeof VerifyEmailValidation>) {
    setisLoading(true);
   
    try {
      const res = await sendVerificationEmail(values.email);
      
      if (res?.success) {
        toast.success("Verify code has been sent to your email.", {
          position: "top-left",
          duration: 3000,
        });
        setEmail(values.email);
      } else {
        toast.error("Cannot send verify code to your email.", {
          position: "top-left",
          duration: 3000,
        });
      }
    } catch (error) {
      console.error("Unexpected error:", error);
    }
  
    setisLoading(false);
  }
  async function onSubmit2(values: z.infer<typeof ForgetPassFormValidation>) {
    setisLoading(true);
    try {
      // Kiểm tra mã xác nhận
      const verify = await verifyCode(email as string, values.verifycode);
  
      if (verify.error) {
        toast.error(`Verify code error: ${verify.error}`, {
          position: "top-left",
          duration: 3000,
        });
        form2.reset()
        setisLoading(false);
        return;
      }
  

  
      // Gọi hàm cập nhật mật khẩu
      const update = await updatePassword(email as string, values.newpassword);
  
      if (update.error) {
        toast.error(`Change password fail: ${update.error}`, {
          position: "top-left",
          duration: 3000,
        });
        return;
      }
      
      toast.success("Change password successfully.", {
        position: "top-left",
        duration: 3000,
      });
      router.push("/")
      // Có thể điều hướng về trang đăng nhập hoặc thông báo thành công
    } catch (error) {
      toast.error("Error in process.", {
        position: "top-right",
        duration: 3000,
      });
    }
  
    setisLoading(false);
  }
  
  
  
  return (
    <Form {...{ ...form1, ...form2 }}>
    <form onSubmit={form1.handleSubmit(onSubmit1)} className="space-y-6 flex-1 w-full max-w-[500px]" >
      
      
      <section className="space-y-6">
         <div className="mb-9 space-y-1">
         <h1 className="sub-header">Verify your email</h1>
         </div>
      </section>

      <div className="flex gap-6 xl:flex-row">
    
      <CustomFormField
        fieldType = {FormFieldType.INPUT}
        control = {form1.control}
        name = 'email'
        label = 'Email'
        placeholder = 'Enter your email'
        iconSrc = '/assets/icons/mail.png'
        iconAlt = 'email'/>
      <div className="flex flex-col h-full">
        <p className="pb-2">Verify</p>
  
        <SubmitButton isLoading={isLoading} className="shad-primary-btn h-11">Click here</SubmitButton>
      </div>
      
      </div>
    </form>
    <form onSubmit={form2.handleSubmit(onSubmit2)} className="space-y-6 flex-1 w-full max-w-[500px] pt-5" >
      <CustomFormField
        fieldType = {FormFieldType.INPUT}
        control = {form2.control}
        name = 'verifycode'
        label = 'Verify code'
        placeholder = 'Enter verify code'
        iconSrc = '/assets/icons/mail.png'
        iconAlt = 'email'/>

      <CustomFormField
        fieldType = {FormFieldType.PASSWORD}
        control = {form2.control}
        name = 'newpassword'
        label= 'New password'
        placeholder = 'Enter your new password'
        iconSrc = '/assets/icons/key.png'
        iconAlt = 'newpassword'
      />

      <CustomFormField
        fieldType = {FormFieldType.PASSWORD}
        control = {form2.control}
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

export default ForgetPasswordForm