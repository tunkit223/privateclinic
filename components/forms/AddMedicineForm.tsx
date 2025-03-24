"use client"
import { addMedicineFormValidation } from '@/lib/validation'
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
import { addMedicine } from '@/lib/actions/medicine.action'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'

const AddMedicineForm = () => {
      const router = useRouter();
      const [isLoading, setisLoading] = useState(false);
      const form = useForm<z.infer<typeof addMedicineFormValidation>>({
      resolver: zodResolver(addMedicineFormValidation),
      defaultValues: {
       name: "",
       unit:"",
       amount: "",
       price:"",
      },
    })
   async function onSubmit(values: z.infer<typeof addMedicineFormValidation>){
    setisLoading(true);
    try {
      const medicineData ={
        name: values.name,
        unit: values.unit,
        amount: Number(values.amount),
        price: Number(values.price),
      }
      const newmedicine = await addMedicine(medicineData);
      if(newmedicine){
        router.refresh();
        toast.success("Add medicine successfully.", {
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
          <h1 className="header">Add new medicine</h1>
          <p className="text-dark-700">Fill in the details</p>
        </section>
       <CustomFormField
          fieldType = {FormFieldType.INPUT}
          control = {form.control}
          name = 'name'
          label = 'Name'
          placeholder = 'Enter medicine'
          iconAlt = 'pill'
        />
        <CustomFormField
                      fieldType={FormFieldType.SELECT}
                      control={form.control}
                      name='unit'
                      label='Unit'
                      placeholder='Select a tag'
                    >
                      {Unit.map((tag) => (
                        <SelectItem
                          key={tag.name}
                          value={tag.name}
                          onClick={() => form.setValue("unit", tag.name)}>
                          <div className="flex items-center gap-2 cursor-pointer">
                            <p>
                              {tag.name}
                            </p>
                          </div>
                        </SelectItem>))}
                    </CustomFormField>
        <CustomFormField
          fieldType = {FormFieldType.INPUT}
          control = {form.control}
          name = 'amount'
          label = 'Amount'
          placeholder = 'Enter amount'
          iconAlt = 'amount'
        />
        <CustomFormField
          fieldType = {FormFieldType.INPUT}
          control = {form.control}
          name = 'price'
          label = 'Price'
          placeholder = 'Enter price'
          iconAlt = 'price'
        />
         <SubmitButton isLoading={isLoading}>Add</SubmitButton>
        </form>  
    </Form>
  )
}

export default AddMedicineForm