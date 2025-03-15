"use client"
 // Trang đăng kí user mới
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Form, FormControl } from "@/components/ui/form"
import CustomFormField from "../CustomFormField"
import SubmitButton from "../SubmitButton"
import { useState } from "react"
import { ForgetPassFormValidation, PatientFormValidation, VerifyEmailValidation } from "@/lib/validation"
import { useRouter } from "next/navigation"
import { registerPatient } from "@/lib/actions/patient.actions"
import { FormFieldType } from "./PatientForm"
import { RadioGroup, RadioGroupItem } from "../ui/radio-group"
import { Doctors, GenderOptions } from "@/constants"
import { Label } from "../ui/label"
import { sendVerificationEmail, updatePassword, verifyCode } from "@/lib/actions/login.actions"

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
        console.log("Verification code sent successfully!");
        setEmail(values.email);
      } else {
        console.error("Error:", res?.error || "Failed to send verification email");
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
        console.error("Lỗi xác thực mã:", verify.error);
        return;
      }
  
      console.log("Mã xác nhận hợp lệ! Tiến hành đổi mật khẩu...");
  
      // Gọi hàm cập nhật mật khẩu
      const update = await updatePassword(email as string, values.newpassword);
  
      if (update.error) {
        console.error("Lỗi cập nhật mật khẩu:", update.error);
        return;
      }
  
      console.log("Đổi mật khẩu thành công!");
      // Có thể điều hướng về trang đăng nhập hoặc thông báo thành công
    } catch (error) {
      console.error("Lỗi trong quá trình xử lý:", error);
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
        iconSrc = '/assets/icons/email.svg'
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
        iconSrc = '/assets/icons/email.svg'
        iconAlt = 'email'/>

      <CustomFormField
        fieldType = {FormFieldType.PASSWORD}
        control = {form2.control}
        name = 'newpassword'
        label= 'New password'
        placeholder = 'Enter your new password'
        iconSrc = '/assets/images/key.png'
        iconAlt = 'newpassword'
      />

      <CustomFormField
        fieldType = {FormFieldType.PASSWORD}
        control = {form2.control}
        name = 'newpasswordagain'
        label= 'New password again'
        placeholder = 'Enter your new password again'
        iconSrc = '/assets/images/key.png'
        iconAlt = 'newpasswordagain'
      />
   
      <SubmitButton isLoading={isLoading}>Change password</SubmitButton>
    </form>
  </Form>
  )
}

export default ForgetPasswordForm