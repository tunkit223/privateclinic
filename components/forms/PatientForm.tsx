"use client"
 
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Form } from "@/components/ui/form"
import CustomFormField from "../CustomFormField"
import SubmitButton from "../SubmitButton"
import { useState } from "react"
import { UserFormValidation } from "@/lib/validation"
import { useRouter } from "next/router"
import  {createUser}  from "@/lib/actions/patient.actions"

export enum FormFieldTypes {
  INPUT = 'input'
  TEXTAREA = 'textarea'
  PHONE_INPUT = 'phoneInput'
  CHECKBOX = 'checkbox'
  DATE_PICKER = 'datePicker'
  SELECT = 'select'
  SKELETON = 'skeleton'
}
 
const PatientForm = () => {
  const router = useRouter();
  const [isLoading, setisLoading] = useState(false);
  const form = useForm<z.infer<typeof UserFormValidation>>({
    resolver: zodResolver(UserFormValidation),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
    },
  })
 

  async function onSubmit({name, email, phone}: z.infer<typeof UserFormValidation>) {

    setisLoading(true);

    try {
        const userData ={ name, email, phone };

        const user = await createUser(userData);

        if(user) router.push(`/patient/${user.id}/register`);
    } catch (error) {
      console.error(error);
    }
  }
  return (
    <Form {...form}>
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 flex-1">
      <section className="mb-12 space-y-4">
          <h1 className="header">Hi there👋</h1>
          <p className="text-dark-700">Schedule your first appointment.</p>
      </section>
      
      <CustomFormField
        filedType = {FormFieldTypes.INPUT}
        control = {form.control}
        name = 'name'
        label = 'Full name'
        placeholder = 'キエト'
        iconSrc = '/assets/icons/user.svg'
        iconAlt = 'user'
      />
      
      <CustomFormField
        filedType = {FormFieldTypes.INPUT}
        control = {form.control}
        name = 'email'
        label = 'Email'
        placeholder = 'tunkit223@gmail.com'
        iconSrc = '/assets/icons/email.svg'
        iconAlt = 'email'
      />

      <CustomFormField
        filedType = {FormFieldTypes.PHONE_INPUT}
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