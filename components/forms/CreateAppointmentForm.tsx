"use client"
 // Trang đăng kí user mới
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, useWatch } from "react-hook-form"
import { z } from "zod"
import { Form, FormControl } from "@/components/ui/form"
import CustomFormField from "../CustomFormField"
import SubmitButton from "../SubmitButton"
import { useEffect, useState } from "react"
import { CreateAppointmentFormValidation } from "@/lib/validation"
import { useRouter } from "next/navigation"
import { FormFieldType } from "./PatientForm"
import { RadioGroup, RadioGroupItem } from "../ui/radio-group"
import { Doctors, GenderOptions } from "@/constants"
import { Label } from "../ui/label"
import { SelectItem } from "../ui/select"
import Image from "next/image"
import { CreateAppointmentAndPatient, getAppointmentWithPatient, } from "@/lib/actions/appointment.action"
import toast from "react-hot-toast"
import { getAvailableDoctors } from "@/lib/actions/workschedules.action"
import { getAllPatients } from "@/lib/actions/patient.actions"
const CreateAppointmentForm = ({ 
  onSuccess,
}: {
  onSuccess?: () => void}) => {
  const router = useRouter();
  const [isLoading, setisLoading] = useState(false);
  const form = useForm<z.infer<typeof CreateAppointmentFormValidation>>({
    resolver: zodResolver(CreateAppointmentFormValidation),
    defaultValues: {
      patientId: "",
      doctor: "",
      date: new Date(Date.now()),
      reason: "",
      note: "",
    },
  })
  
  const [patients, setPatients] = useState<{ _id: string, name: string }[]>([]);
  useEffect(() => {
   getAllPatients().then(setPatients);
  }, []);
  const [availableDoctors, setAvailableDoctors] = useState<{ _id: string, name: string, image: string }[]>([]);
  
   const watchedDate = useWatch({
    control: form.control,
    name: "date",
  });
  
  useEffect(() => {
    if (!watchedDate) return;
  
    let dateObj = new Date(watchedDate);
    if (isNaN(dateObj.getTime())) return;
  
    const isoDate = dateObj; 
    const hour = dateObj.getHours();
    const shift = hour < 13 ? "Morning" : "Afternoon";
  
    getAvailableDoctors(isoDate, shift)
      .then((doctors) => {
        setAvailableDoctors(doctors);
      })
      .catch((err) => {
        console.error("Error fetching doctors", err);
        toast.error("Failed to load doctors.");
      });
  }, [watchedDate?.toISOString()]); 
  
  async function onSubmit(values: z.infer<typeof CreateAppointmentFormValidation>) {
    setisLoading(true);

   try {
    const res = await CreateAppointmentAndPatient(values)

     if (res.success) {
    toast.success("Created successfully!", {
      position: "top-left",
      duration: 3000,
    });
    router.refresh();
    onSuccess?.();
  } else {
    toast.error("Cannot create: " + res.error, {
      position: "top-left",
      duration: 3000,
    });
  }
  } catch (error) {
    console.error("Submit error", error)
  } finally {
    setisLoading(false);
  }
  }
  
  return (
    <Form {...form}>
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 flex-1">
      
     <CustomFormField
      fieldType={FormFieldType.SELECT}
      control={form.control}
      name="patientId"
      label="Patient"
      placeholder="Select a patient"
    >
      {patients.map((patient) => (
        <SelectItem key={patient._id} value={patient._id}>
          {patient.name}
        </SelectItem>
      ))}
    </CustomFormField>
       <CustomFormField
        fieldType={FormFieldType.DATE_PICKER}
        control={form.control}
        name="date"
        label='Expected appointment date'
        showTimeSelect
        dateFormat="dd/MM/yyyy - h:mm aa"
      />
    <CustomFormField
        fieldType={FormFieldType.SELECT}
        control={form.control}
        name="doctor"
        label="Doctor"
        placeholder="Select a Doctor"
      >
        {availableDoctors.map((doctor) => (
          <SelectItem key={doctor._id} value={doctor._id}>
            <div className="flex items-center gap-2 cursor-pointer">
              <Image
                src={doctor.image || '/assets/images/employee.png'}
                alt={doctor.name}
                width={32}
                height={32}
                className="rounded-full border border-dark-200"
              />
              <p>{doctor.name}</p>
            </div>
          </SelectItem>
        ))}
      </CustomFormField>
    
     
      <div className="flex flex-col xl:flex-row xl:gap-6">
        <CustomFormField
          fieldType={FormFieldType.TEXTAREA}
          control={form.control}
          name="reason"
          label='Reason for appointment'
          placeholder="Enter reason for appointment"
        />
        <CustomFormField
          fieldType={FormFieldType.TEXTAREA}
          control={form.control}
          name="note"
          label='Notes'
          placeholder="Enter notes"
        />
      </div>
      <SubmitButton isLoading={isLoading}>Create</SubmitButton>
    </form>
  </Form>
  )
}

export default CreateAppointmentForm