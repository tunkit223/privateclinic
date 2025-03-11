"use client"
import React, { useState } from 'react'
import Image from 'next/image'
import AppointmentForm from '@/components/forms/AppointmentForm'
import { Appointment } from '@/types/appwrite.type'
import { Types } from 'mongoose'
import { useParams } from 'next/navigation'
import { IAppointment } from '@/database/appointment.model'

const Appointments = ({
  type,
  appointment,
}:{
  type:'create' 
  appointment?:IAppointment,
}) => {
  const [open, setOpen] = useState(false)
  const { patientId } = useParams();
  return (
    <div className="flex h-screen max-h-screen">
      {/* TODO: OTP Verification | PasskeyModal <>?*/}

      <section className="remove-scrollbar container">
        <div className="sub-container max-w-[780px] flex-1 flex-col py-10">
          <Image
            src = "/assets/icons/logo-full.svg"
            height = {1000}
            width = {1000}
            alt = "patinent"
            className="mb-12 h-10 w-fit"
          />
          
          <AppointmentForm 
            patientId={patientId as string}
            type='create'
            appointment={appointment}
            setOpen={setOpen}
          />

          <p className="copy-right py-10">
               © 2025 CarePulse
          </p>      
        </div>
      </section>

    </div>
  )
}

export default Appointments

