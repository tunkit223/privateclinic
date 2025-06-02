"use client"
//Trang để tạo appointment mới
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, useWatch } from "react-hook-form"
import { boolean, z } from "zod"
import { Form } from "@/components/ui/form"
import CustomFormField from "../CustomFormField"
import SubmitButton from "../SubmitButton"
import { useEffect, useState } from "react"
import { CancelAppointmentSchema, CreateAppointmentSchema, getAppointmentSchema } from "@/lib/validation"
import { useRouter } from "next/navigation"
import { FormFieldType } from "./PatientForm"
import { Doctors } from "@/constants"
import { SelectItem } from "@/components/ui/select"
import Image from "next/image"
import { cancelAppointment, createAppointment } from "@/lib/actions/appointment.action"
import { Appointment } from "@/types/appwrite.type"
import { updateAppointment } from "@/lib/actions/appointment.action"
import { IAppointment } from "@/database/appointment.model"
import mongoose from "mongoose";
import toast from "react-hot-toast"
import { getAvailableDoctors } from "@/lib/actions/workschedules.action"
const AppointmentForm = ({
  patientId, type, appointment, setOpen
}: {
  patientId: string;
  type: 'create' | 'cancel' | 'confirm';
  appointment?: IAppointment;
  setOpen: (open: boolean) => void;
}) => {
  const router = useRouter();
  const [isLoading, setisLoading] = useState(false);

  const form1 = useForm<z.infer<typeof CreateAppointmentSchema>>({
    resolver: zodResolver(CreateAppointmentSchema),
    defaultValues: {
      doctor:  "",
      date:  new Date(Date.now()),
      reason: "",
      note: "",
      status:"",
    },
  })

  const form2 = useForm<z.infer<typeof CancelAppointmentSchema>>({
    resolver: zodResolver(CancelAppointmentSchema),
    defaultValues: {
      cancellationReason: ""
    },
  })

  
  const [availableDoctors, setAvailableDoctors] = useState<{ _id: string, name: string, image: string }[]>([]);

 const watchedDate = useWatch({
  control: form1.control,
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

console.log("watchedDate:", watchedDate);




  async function onSubmit1(values: z.infer<typeof CreateAppointmentSchema>) {
    setisLoading(true);
    let status;
    switch(type){
      case 'confirm':
        status = 'confirmed';
        break;
      case 'cancel':
        status = 'cancelled';
        break;
      default:
        status = 'pending';
        break;
      }

    try {
      if (type === 'create' && patientId) {
        const appointmentData = {
          patientId:  patientId,
          doctor: values.doctor,
          date: new Date(values.date),
          reason: values.reason!,
          note: values.note,
          status: status as Status,
        }
        const appointment = await createAppointment(appointmentData);

        if (appointment) {
          form1.reset();
          router.push(`/patient/${patientId}/appointment/success?appointmentId=${appointment._id}`);
        }
      }

    } catch (error) {
      console.log(error);
      toast.error("The date is full of appointments, please choose another date.", {
          position: "top-left",
          duration: 3000,
        });
    }
    setisLoading(false);
  }

  async function onSubmit2(values: z.infer<typeof CancelAppointmentSchema>) {
    setisLoading(true);
    let status;
    switch(type){
      case 'confirm':
        status = 'confirmed';
        break;
      case 'cancel':
        status = 'cancelled';
        break;
      default:
        status = 'pending';
        break;
      }

    try {
    
        const cancel = await cancelAppointment(appointment?._id!,values.cancellationReason!)
        if(cancel){
          toast.success("Cancel appointment successfully.", {
                  position: "top-left",
                  duration: 3000,
                });
         router.refresh();
        }
        else{
          toast.error("Cannot cancel(appointment had been finished or cancelled).", {
                  position: "top-left",
                  duration: 3000,
                });
        }

    } catch (error) {
      console.log(error);
    }
    setisLoading(false);
  }

  let buttonLabel;

  switch (type) {
    case 'create':
      buttonLabel = 'Create Appointment';
      break;
    case 'cancel':
      buttonLabel = 'Cancel Appointment';
      break;
    case 'confirm':
      buttonLabel = 'Confirm Appointment';
      break;
    default:
      buttonLabel = 'Get started';
  }

  return (
    <Form {...{ ...form1, ...form2 }}>
      {type==='create' && (
      <form onSubmit={form1.handleSubmit((values) => {
          console.log("Form is being submitted");
          onSubmit1(values);
          }, (errors) => {
          console.log("Form validation errors:", errors);
      })} className="space-y-6 flex-1">
           <section className="mb-12 space-y-4">
            <h1 className="header">New Appointment</h1>
            <p className="text-dark-400">Request a new appointment in 10 seconds</p>
          </section>
           <CustomFormField
              fieldType={FormFieldType.DATE_PICKER}
              control={form1.control}
              name="date"
              label='Expected appointment date'
              showTimeSelect
              dateFormat="dd/MM/yyyy - h:mm aa"
            />
            <CustomFormField
              fieldType={FormFieldType.SELECT}
              control={form1.control}
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

           
            <div className="flex flex-col gap-6 xl:flex-row xl:gap-6">
              <CustomFormField
                fieldType={FormFieldType.TEXTAREA}
                control={form1.control}
                name="reason"
                label='Reason for appointment'
                placeholder="Enter reason for appointment"
              />
              <CustomFormField
                fieldType={FormFieldType.TEXTAREA}
                control={form1.control}
                name="note"
                label='Notes'
                placeholder="Enter notes"
              />
            </div>

       

        <SubmitButton isLoading={isLoading}
         className=" shad-primary-btn w-full"
        >{buttonLabel}
        </SubmitButton>

      </form>)}

      {type==='cancel' && (
      <form onSubmit={form2.handleSubmit((values) => {
          console.log("Form is being submitted");
          onSubmit2(values);
          }, (errors) => {
          console.log("Form validation errors:", errors);
      })} className="space-y-6 flex-1">
         {type === 'cancel' && (
          <CustomFormField
            fieldType={FormFieldType.TEXTAREA}
            control={form2.control}
            name="cancellationReason"
            label='Reason for cancellation'
            placeholder="Enter reason for cancellation"
          />
        )}
         <SubmitButton isLoading={isLoading}
         className="shad-danger-btn  w-full"
        >{buttonLabel}
        </SubmitButton>
      </form>)}
  </Form>
  )
}

export default AppointmentForm