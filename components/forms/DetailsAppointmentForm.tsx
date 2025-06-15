"use client"
 // Trang đăng kí user mới
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, useWatch } from "react-hook-form"
import { z } from "zod"
import { Form, FormControl } from "@/components/ui/form"
import CustomFormField from "../CustomFormField"
import SubmitButton from "../SubmitButton"
import { useEffect, useState } from "react"
import { DetailsAppointmentFormValidation } from "@/lib/validation"
import { useRouter } from "next/navigation"
import { FormFieldType } from "./PatientForm"
import { RadioGroup, RadioGroupItem } from "../ui/radio-group"
import { Doctors, GenderOptions } from "@/constants"
import { Label } from "../ui/label"
import { SelectItem } from "../ui/select"
import Image from "next/image"
import { getAppointmentWithPatient, updateAppointmentAndPatient } from "@/lib/actions/appointment.action"
import toast from "react-hot-toast"
import { getAvailableDoctors } from "@/lib/actions/workschedules.action"
const DetailsAppointmentForm = ({ 
  appointmentId,
  onSuccess,
  disabled = false,
}: {
  appointmentId: string
  onSuccess?: () => void
  disabled?: boolean
}
) => {
  const router = useRouter();
  const [isLoading, setisLoading] = useState(false);
  const form = useForm<z.infer<typeof DetailsAppointmentFormValidation>>({
    resolver: zodResolver(DetailsAppointmentFormValidation),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      birthdate: new Date(Date.now()),
      gender: "male" as Gender,
      address: "",
      doctor: "",
      date: new Date(Date.now()),
      reason: "",
      note: "",
    },
  })
  
  useEffect(() => {
  async function fetchData() {
    const data = await getAppointmentWithPatient(appointmentId)
    if (data) {
      form.reset({
        ...data,
        phone: data.phone.toString().startsWith("+")
        ? data.phone.toString()
        : `+${data.phone.toString()}`, 
        birthdate: new Date(data.birthdate),
        date: new Date(data.date),
        doctor: data.doctor || "",
      })
    }
  }

  fetchData()
}, [appointmentId])
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
  
  async function onSubmit(values: z.infer<typeof DetailsAppointmentFormValidation>) {
    setisLoading(true);

   try {
    const res = await updateAppointmentAndPatient(appointmentId, values)

    if (res.error) {
      console.error(res.error)
      return
    }
    if(res.success){
        router.refresh();
        toast.success("Adjust successfully.", {
          position: "top-left",
          duration: 3000,
        });
      }
      else{
        toast.error("Cannot adjust.", {
          position: "top-left",
          duration: 3000,
        });
      }
    router.refresh()
    onSuccess?.()
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
        fieldType = {FormFieldType.INPUT}
        control = {form.control}
        name = 'name'
        label= 'Full name'
        placeholder = 'Your full name'
        iconSrc = '/assets/icons/user.png'
        iconAlt = 'user'
      />
      
    <div className="flex flex-col gap-6 xl:flex-row">
      <CustomFormField
        fieldType = {FormFieldType.INPUT}
        control = {form.control}
        name = 'email'
        label = 'Email'
        placeholder = 'tunkit223@gmail.com'
        iconSrc = '/assets/icons/mail.png'
        iconAlt = 'email'
      />

      <CustomFormField
        fieldType = {FormFieldType.PHONE_INPUT}
        control = {form.control}
        name = 'phone'
        label = 'Phone number'
        placeholder = '(84+) 913 834 393'
      />
    </div>

    <div className="flex flex-col gap-6 xl:flex-row">
      <CustomFormField
        fieldType = {FormFieldType.DATE_PICKER}
        control = {form.control}
        name = 'birthdate'
        label = 'Date of Birth'
      />

      <CustomFormField
        fieldType = {FormFieldType.SKELETON}
        control = {form.control}
        name = 'gender'
        label = 'Gender'
        renderSkeleton={(field) => (
          <FormControl>
            <RadioGroup className="flex h-11 gap-6 xl:jusutify-between"
            onValueChange={field.onChange}
            value={field.value}
            >
              {GenderOptions.map((option)=>(
                <div key={option} className="radio-group">
                    <RadioGroupItem value={option} id={option}/>
                    <Label htmlFor={option} className="cursor-pointer">
                      {option}
                    </Label>
                </div>
              ))}
            </RadioGroup>
          </FormControl>
        )}
      />
    </div>

    <div className="flex flex-col xl:flex-row">
      <CustomFormField
          fieldType = {FormFieldType.INPUT}
          control = {form.control}
          name = 'address'
          label = 'Address'
          placeholder = 'Linh Trung ward, Thu Đuc, Ho Chi Minh city'
      />
      </div>
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
      <SubmitButton isLoading={isLoading} disabled={disabled}>Adjust</SubmitButton>
    </form>
  </Form>
  )
}

export default DetailsAppointmentForm