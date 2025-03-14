"use client"
 // Trang đăng kí user mới
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Form, FormControl } from "@/components/ui/form"
import CustomFormField from "../CustomFormField"
import SubmitButton from "../SubmitButton"
import { useState } from "react"
import { PatientFormValidation, AccountFormValidation, LoginFormValidation } from "@/lib/validation"
import { useRouter } from "next/navigation"
import { registerPatient } from "@/lib/actions/patient.actions"
import { FormFieldType } from "./PatientForm"
import { RadioGroup, RadioGroupItem } from "../ui/radio-group"
import { Doctors, GenderOptions } from "@/constants"
import { Label } from "../ui/label"
import { loginAccount } from "@/lib/actions/login.actions"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert-dialog";
const LoginForm = () => {
  const router = useRouter();
  const [isLoading, setisLoading] = useState(false);
  const form = useForm<z.infer<typeof LoginFormValidation>>({
    resolver: zodResolver(LoginFormValidation),
    defaultValues: {
      email: "",
      password:"",
    },
  })

  async function onSubmit(values: z.infer<typeof LoginFormValidation>) {
    setisLoading(true);
    console.log("im here on submit")
  try {
    const accountData = {
      email: values.email,
      password: values.password
    };

    const loginsuccess = await loginAccount(accountData);

    if (loginsuccess) {
      router.push(`${loginsuccess._id}`); 
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
        name = 'password'
        label= 'Password'
        placeholder = 'Enter your password'
        iconSrc = '/assets/images/key.png'
        iconAlt = 'password'
      />
   
      <SubmitButton isLoading={isLoading}>Login</SubmitButton>
    </form>
  </Form>
  )
}

export default LoginForm