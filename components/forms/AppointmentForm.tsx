"use client"
//Trang để tạo appointment mới
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { boolean, z } from "zod"
import { Form } from "@/components/ui/form"
import CustomFormField from "../CustomFormField"
import SubmitButton from "../SubmitButton"
import { useState } from "react"
import { getAppointmentSchema } from "@/lib/validation"
import { useRouter } from "next/navigation"
import { FormFieldType } from "./PatientForm"
import { Doctors } from "@/constants"
import { SelectItem } from "@/components/ui/select"
import Image from "next/image"
import { createAppointment } from "@/lib/actions/appointment.action"
import { Appointment } from "@/types/appwrite.type"
import { updateAppointment } from "@/lib/actions/appointment.action"
import { IAppointment } from "@/database/appointment.model"
import mongoose from "mongoose";
const AppointmentForm = ({
  patientId, type, appointment, setOpen
}: {
  patientId: string;
  type: 'create' | 'cancel' | 'finish';
  appointment?: IAppointment;
  setOpen: (open: boolean) => void;
}) => {
  const router = useRouter();
  const [isLoading, setisLoading] = useState(false);
  const AppointmentFormValidation = getAppointmentSchema(type)

  const form = useForm<z.infer<typeof AppointmentFormValidation>>({
    resolver: zodResolver(AppointmentFormValidation),
    defaultValues: {
      // patientId: appointment ? appointment.patientId : "",
      // doctor: appointment ? appointment.doctor : "",
      // date: appointment ? new Date(appointment.date) : new Date(),
      // reason: appointment ? appointment.reason : "",
      // note: appointment ? appointment.note : "",
      // // cancellationReason: appointment?.cancellationReason||""
      doctor:  "",
      date:  new Date(Date.now()),
      reason: "",
      note: "",
      status:"",
      cancellationReason: ""
    },
  })

  
  async function onSubmit(values: z.infer<typeof AppointmentFormValidation>) {
    setisLoading(true);
    let status;
    switch(type){
      case 'finish':
        status = 'finished';
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
        console.log("im here onSubmit")

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
          form.reset();
          router.push(`/patient/${patientId}/appointment/success?appointmentId=${appointment._id}`);
        }
      }
      // dang tinh chinh
      else {
        //fetch du lieu cu len, thay doi sau
        const appointmentToUpdate = {
          appointmentId: appointment?._id!,
          appointment:{
            doctor:values?.doctor,
            finish: new Date(values?.date),
            status: status as Status,
            cancellationReasons: values?.cancellationReason,
          },
          type
        }

        // const updatedAppointment = await updateAppointment(appointmentToUpdate);

        // if(updatedAppointment){
        //   setOpen && setOpen(false);
        //   form.reset();
        // }
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
    case 'finish':
      buttonLabel = 'Finish Appointment';
      break;
    default:
      buttonLabel = 'Get started';
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit((values) => {
          console.log("Form is being submitted");
          onSubmit(values);
          }, (errors) => {
          console.log("Form validation errors:", errors);
      })} className="space-y-6 flex-1">
        <section className="mb-12 space-y-4">
          <h1 className="header">New Appointment</h1>
          <p className="text-dark-700">Request a new appointment in 10 seconds</p>
        </section>

        {type==='create' && (
          <>
            <CustomFormField
              fieldType={FormFieldType.SELECT}
              control={form.control}
              name='doctor'
              label='Doctor'
              placeholder='Select a Doctor'
            >
              {Doctors.map((doctor) => (
                <SelectItem
                  key={doctor.name}
                  value={doctor.name}
                  onClick={() => form.setValue("doctor", doctor.name)}>
                  <div className="flex items-center gap-2 cursor-pointer">
                    <Image
                      src={doctor.image}
                      alt={doctor.name}
                      width={32}
                      height={32}
                      className="rounded-full border border-dark-200"
                    />
                    <p>
                      {doctor.name}
                    </p>
                  </div>
                </SelectItem>))}
            </CustomFormField>

            <CustomFormField
              fieldType={FormFieldType.DATE_PICKER}
              control={form.control}
              name="date"
              label='Expected appointment date'
              showTimeSelect
              dateFormat="dd/MM/yyyy - h:mm aa"
            />
            <div className="flex flex-col gap-6 xl:flex-row xl:gap-6">
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

          </>
        )}

        {type === 'cancel' && (
          <CustomFormField
            fieldType={FormFieldType.TEXTAREA}
            control={form.control}
            name="cancellationReason"
            label='Reason for cancellation'
            placeholder="Enter reason for cancellation"
          />
        )}

        <SubmitButton isLoading={isLoading}
         className={`${type === 'cancel' ? 'shad-danger-btn' : 'shad-primary-btn'} w-full`}
        >{buttonLabel}
        </SubmitButton>

      </form>

    </Form>
  )
}

export default AppointmentForm