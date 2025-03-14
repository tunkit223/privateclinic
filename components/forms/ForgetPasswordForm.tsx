"use client"
 // Trang đăng kí user mới
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Form, FormControl } from "@/components/ui/form"
import CustomFormField from "../CustomFormField"
import SubmitButton from "../SubmitButton"
import { useState } from "react"
import { ForgetPassFormValidation, PatientFormValidation } from "@/lib/validation"
import { useRouter } from "next/navigation"
import { registerPatient } from "@/lib/actions/patient.actions"
import { FormFieldType } from "./PatientForm"
import { RadioGroup, RadioGroupItem } from "../ui/radio-group"
import { Doctors, GenderOptions } from "@/constants"
import { Label } from "../ui/label"

const ForgetPasswordForm = () => {
  const router = useRouter();
  const [isLoading, setisLoading] = useState(false);
  const form = useForm<z.infer<typeof ForgetPassFormValidation>>({
    resolver: zodResolver(ForgetPassFormValidation),
    defaultValues: {
      email: "",
      newpassword:"",
      newpasswordagain:""
    },
  })
 
 // function đăng kí bệnh nhân
  async function onSubmit(values: z.infer<typeof ForgetPassFormValidation>) {
    setisLoading(true);

  try {
    const patientData = {
      ...values,
      birthDate: new Date(), // Chuyển đổi ngày
      // Xóa tất cả logic xử lý file của Appwrite
    };

    // Gọi action Mongoose trực tiếp
    const newPatient = await registerPatient(patientData);

    if (newPatient) {
      router.push(`/patient/${newPatient._id}/appointment`); // Điều hướng thành công
    }
  } catch (error) {
    console.error('Lỗi đăng ký:', error);
    form.setError('root', {
      type: 'manual',
      message: error instanceof Error ? error.message : 'Lỗi đăng ký',
    });
  } finally {
    setisLoading(false);
  }
  }
  
  return (
    <Form {...form}>
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 flex-1 w-full max-w-[500px]" >
      
      
      <section className="space-y-6">
         <div className="mb-9 space-y-1">
         <h1 className="sub-header">Login now</h1>
         </div>
      </section>


  
    <CustomFormField
        fieldType = {FormFieldType.INPUT}
        control = {form.control}
        name = 'email'
        label = 'Email'
        placeholder = 'Enter your email'
        iconSrc = '/assets/icons/email.svg'
        iconAlt = 'email'
      />


      <CustomFormField
        fieldType = {FormFieldType.PASSWORD}
        control = {form.control}
        name = 'newpassword'
        label= 'New password'
        placeholder = 'Enter your new password'
        iconSrc = '/assets/images/key.png'
        iconAlt = 'newpassword'
      />

      <CustomFormField
        fieldType = {FormFieldType.PASSWORD}
        control = {form.control}
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