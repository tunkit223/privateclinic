// Trang chính
import Image from "next/image";
import AppointmentForm from "@/components/forms/AppointmentForm";
import { getPatient } from "@/lib/actions/patient.actions";

export default async function NewAppointment({params}: SearchParamProps) {
  params = await params;
  const userId = params.userId;
  const patient = await getPatient(userId);
  
  return (
    <div className="flex h-screen max-h-screen">
      {/* TODO: OTP Verification | PasskeyModal <>?*/}

      <section className="remove-scrollbar container my-auto">
        <div className="sub-container max-w-[780px] flex-1 justify-between">
          <Image
            src = "/assets/icons/logo-full.svg"
            height = {1000}
            width = {1000}
            alt = "patinent"
            className="mb-12 h-10 w-fit"
          />

           <AppointmentForm
           type='create'
           userId={userId}
           patientId={patient.$id}
           /> 
           <p className="justify-items-end text-dark-600 xl:text-left py-10">
               © 2025 CarePulse
           </p>
          
        </div>
      </section>

      <Image
        src="/assets/images/appointment-img.png"
        height={1000}
        width={1000}
        alt="appointment"
        className="side-img max-w-[390px] bg-bottom"
      />
    </div>
  );
}
