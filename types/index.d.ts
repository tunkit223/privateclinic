/* eslint-disable no-unused-vars */

declare type SearchParamProps = {
  params: { [key: string]: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

declare type Gender = "Male" | "Female" | "Other";
declare type Status = "pending" | "confirmed" | "cancelled" | "imported" | "importing";
declare type MedicalStatus = "unexamined" | "examined" | "examining"
declare type Usertype = "Admin" | "User"
declare type Diseasetype = "Hypertension" | "Diabetes mellitus" | "Common cold" | "Gastritis" | "Asthma"
declare type Usage = "Take one tablet by mouth every 8 hours" | "Apply a thin layer to the affected area twice daily" | "Inhale one puff every 6 hours as needed" | "Inject 1 mL subcutaneously once a week"
declare interface CreateUserParams {
  name: string;
  email: string;
  phone: string;
};




declare type UpdateAppointmentParams = {
  appointmentId: string;
  patientId: string;
  appointment: IAppointment;
  type: string;
};