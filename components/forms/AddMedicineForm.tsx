"use client";
import { medicineFormSchema } from '@/lib/validation'
import { zodResolver } from '@hookform/resolvers/zod'
import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Form } from "@/components/ui/form"
import { z } from 'zod'
import CustomFormField from '../CustomFormField'
import { FormFieldType } from './PatientForm'
import { SelectItem } from '../ui/select'
import { Unit } from '@/constants'
import { MedicineTypes } from '@/constants'
import SubmitButton from '../SubmitButton'
import { addMedicine } from '@/lib/actions/medicine.action'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'
import { useParams } from 'next/navigation';
import { getMedicineTypeList} from '@/lib/actions/medicineType.action'


const AddMedicineForm = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [medicineTypes, setMedicineTypes] = useState<{ name: string; _id: string }[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const result = await getMedicineTypeList();
      if (result?.documents) {
        setMedicineTypes(result.documents);
      }
    };

    fetchData();
  }, []);
     
  // Set up the form with react-hook-form and validation
  const form = useForm<z.infer<typeof medicineFormSchema>>({
    resolver: zodResolver(medicineFormSchema),
    defaultValues: {
      name: "",
      medicineTypeId: "",
      unit: "",
      amount: "",
      price: "",
    },
  });

  // Handle form submission
  async function onSubmit(values: z.infer<typeof medicineFormSchema>) {
    setIsLoading(true);
    try {
      const medicineData = {
        name: values.name,
        unit: values.unit,
        medicineTypeId: values.medicineTypeId,
        amount: Number(values.amount),
        price: Number(values.price),
      };
      const newMedicine = await addMedicine(medicineData);
      if (newMedicine) {
        router.refresh();
        toast.success("Add medicine successfully.", {
          position: "top-left",
          duration: 3000,
        });
      } else {
        toast.error("Cannot add medicine.", {
          position: "top-left",
          duration: 3000,
        });
      }
    } catch (error) {
      console.log(error);
    }
    setIsLoading(false);
    form.reset();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2 flex-1 w-full max-w-[500px]">
        <section className="mb-12 space-y-4">
          <h1 className="header">Add new medicine</h1>
          <p className="text-dark-700">Fill in the details</p>
        </section>
        
        <CustomFormField
          fieldType={FormFieldType.INPUT}
          control={form.control}
          name="name"
          label="Name"
          placeholder="Enter medicine"
          iconAlt="pill"
        />
        <CustomFormField
          fieldType={FormFieldType.SELECT}
          control={form.control}
          name="medicineTypeId"
          label="Medicine Type"
          placeholder="Select a tag">
            {medicineTypes.map((type) => (
        <SelectItem
          key={type._id}
          value={type._id}
          onClick={() => form.setValue("medicineTypeId", type._id)}
        >
          <div className="flex items-center gap-2 cursor-pointer">
            <p>{type.name}</p>
          </div>
        </SelectItem>
      ))}
          </CustomFormField>
        


        
        <CustomFormField
          fieldType={FormFieldType.SELECT}
          control={form.control}
          name="unit"
          label="Unit"
          placeholder="Select a tag"
        >
          {Unit.map((tag) => (
            <SelectItem
              key={tag.name}
              value={tag.name}
              onClick={() => form.setValue("unit", tag.name)}
            >
              <div className="flex items-center gap-2 cursor-pointer">
                <p>{tag.name}</p>
              </div>
            </SelectItem>
          ))}
        </CustomFormField>

        <CustomFormField
          fieldType={FormFieldType.INPUT}
          control={form.control}
          name="price"
          label="Price"
          placeholder="Enter price"
          iconAlt="price"
        />
        
        <SubmitButton isLoading={isLoading}>Add</SubmitButton>
      </form>
    </Form>
  );
};

export default AddMedicineForm;
