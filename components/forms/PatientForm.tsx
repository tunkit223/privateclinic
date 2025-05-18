"use client"
 //Trang để tạo user mới
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Form } from "@/components/ui/form"
import CustomFormField from "../CustomFormField"
import SubmitButton from "../SubmitButton"
import { useState } from "react"
import { AccountFormValidation } from "@/lib/validation"
import { useRouter } from "next/navigation"
import { users } from "@/lib/appwrite.config"
import { Query } from "node-appwrite"


export enum FormFieldType {
  INPUT = 'input',
  TEXTAREA = 'textarea',
  PHONE_INPUT = 'phoneInput',
  CHECKBOX = 'checkbox',
  DATE_PICKER = 'datePicker',
  SELECT = 'select',
  SKELETON = 'skeleton',
  PASSWORD = 'password'
}
 
const PatientForm = () => {
  const router = useRouter();
  const [isLoading, setisLoading] = useState(false);
  const form = useForm<z.infer<typeof AccountFormValidation>>({
    resolver: zodResolver(AccountFormValidation),
    defaultValues: {
      email: "",

    },
  })
 
 
  async function onSubmit({email,  }: z.infer<typeof AccountFormValidation>) {
    setisLoading(true);
    try {

      const existingUser = await users.list([Query.equal("email", email)]);
    
    if (existingUser.total > 0) {
      router.push(`/patients/${existingUser.users[0].$id}/new-appointment`);
    } else {
      
    }
      

    } catch (error) {
      console.log(error);
    } 
    setisLoading(false);
  }
  
  return (
    <Form {...form}>
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 flex-1">
      <section className="mb-12 space-y-4">
          <h1 className="header">Hi there👋</h1>
          <p className="text-dark-700">Schedule your first appointment.</p>
      </section>
      
      <CustomFormField
        fieldType = {FormFieldType.INPUT}
        control = {form.control}
        name = 'name'
        label = 'Full name'
        placeholder = 'キエト'
        iconSrc = '/assets/icons/user.png'
        iconAlt = 'user'
      />
      
      <CustomFormField
        fieldType = {FormFieldType.INPUT}
        control = {form.control}
        name = 'email'
        label = 'Email'
        placeholder = 'tunkit223@gmail.com'
        iconSrc = '/assets/icons/email.svg'
        iconAlt = 'email'
      />

      <CustomFormField
        fieldType = {FormFieldType.PHONE_INPUT}
        control = {form.control}
        name = 'phone'
        label = 'Phone number'
        placeholder = '(84+) 913 834 393'
      />

      <SubmitButton isLoading={isLoading}>Get started</SubmitButton>
    </form>
  </Form>
  )
}

export default PatientForm