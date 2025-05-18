"use client"
import { addMedicineTypeFormValidation } from '@/lib/validation'
import { zodResolver } from '@hookform/resolvers/zod'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Form } from "@/components/ui/form"
import { z } from 'zod'
import CustomFormField from '../CustomFormField'
import { FormFieldType } from './PatientForm'
import { SelectItem } from '../ui/select'
import { Unit } from '@/constants'
import SubmitButton from '../SubmitButton'
import { addMedicineType } from '@/lib/actions/medicineType.action'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'

const AddMedicineTypeForm = () => {
      const router = useRouter();
      const [isLoading, setisLoading] = useState(false);
      const form = useForm<z.infer<typeof addMedicineTypeFormValidation>>({
      resolver: zodResolver(addMedicineTypeFormValidation),
      defaultValues: {
       name: "",
       description:"",
      },
    })
   async function onSubmit(values: z.infer<typeof addMedicineTypeFormValidation>){
    setisLoading(true);
    try {
      const medicineTypeData ={
        name: values.name,
        description: values.description,
      }
      const newmedicineType = await addMedicineType(medicineTypeData);
 
      if(newmedicineType){
        router.refresh();
        toast.success("Add medicine type successfully.", {
          position: "top-left",
          duration: 3000,
        });
      }
      else{
        toast.error("Cannot add medicine.", {
          position: "top-left",
          duration: 3000,
        });
      }
    } catch (error) {
      console.log(error)
    }
    setisLoading(false);
    form.reset();
   }
  return (
    <Form {...form}>
       <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2 flex-1 w-full max-w-[500px]" >
       <section className="mb-12 space-y-4">
          <h1 className="header">Add new medicine type</h1>
          <p className="text-dark-700">Fill in the details</p>
        </section>
       <CustomFormField
          fieldType = {FormFieldType.INPUT}
          control = {form.control}
          name = 'name'
          label = 'Name'
          placeholder = 'Enter medicine type'
          iconAlt = 'pill'
        />
        <CustomFormField
          fieldType = {FormFieldType.INPUT}
          control = {form.control}
          name = 'description'
          label = 'Description'
          placeholder = 'Enter description for medicine type'
          iconAlt = 'price'
        />
         <SubmitButton isLoading={isLoading}>Add</SubmitButton>
        </form>  
    </Form>
  )
}

export default AddMedicineTypeForm