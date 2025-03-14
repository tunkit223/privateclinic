/* eslint-disable no-unused-vars */

declare type SearchParamProps = {
  params: { [key: string]: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

declare type Gender = "Male" | "Female" | "Other";
declare type Status = "pending" | "finished" | "cancelled"
declare type Usertype = "Admin" | "User"
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