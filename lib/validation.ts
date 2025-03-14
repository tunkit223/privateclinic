import { z } from "zod";
// Trang check các thuộc tính của user
export const AccountFormValidation = z.object({
  password: z.string()
    .min(6, "Password must be at least 6 characters.")
    .max(50, "Password must be at most 50 characters."),
  email: z.string().email("Invalid email address."),
  tag: z.string()
  .min(1, "Tag must be at least 1 property"),
})
export const LoginFormValidation = z.object({
  password: z.string()
    .min(6, "Password must be at least 6 characters.")
    .max(50, "Password must be at most 50 characters."),
  email: z.string().email("Invalid email address."),
})
export const UserFormValidation = z.object({
  name: z.string()
    .min(1, "Name must be at least 1 characters.")
    .max(50, "Name must be at most 50 characters."),
  username: z.string()
    .min(1, "Username must be at least 1 characters.")
    .max(50, "Username must be at most 50 characters."),
  phone: z
    .string()
    .refine((phone) => /^((\+84|0)[3|5|7|8|9])+([0-9]{8})$/.test(phone), 'Invalid phone number'),
  address: z.string()
    .min(1, "Address must be at least 1 characters.")
    .max(50, "Address must be at most 50 characters."),
})
export const ForgetPassFormValidation = z.object({
  newpassword: z.string()
    .min(6, "Password must be at least 6 characters.")
    .max(50, "Password must be at most 50 characters."),
  newpasswordagain:z.string()
    .min(6, "Password must be at least 6 characters.")
    .max(50, "Password must be at most 50 characters."),
  email: z.string().email("Invalid email address."),
})

export const PatientFormValidation = z.object({
  name: z
    .string()
    .min(1, "Name must be at least 1 characters")
    .max(50, "Name must be at most 50 characters"),
  email: z.string().email("Invalid email address"),
  phone: z
    .string()
    .refine((phone) => /^((\+84|0)[3|5|7|8|9])+([0-9]{8})$/.test(phone), 'Invalid phone number'),
  birthdate: z.coerce.date(),
  gender: z.enum(["Male", "Female", "Other"]),
  address: z
    .string()
    .min(5, "Address must be at least 5 characters")
    .max(500, "Address must be at most 500 characters"),

});
export const CreateAppointmentSchema = z.object({
  doctor: z.string().min(2, "Select at least one doctor"),
  date: z.coerce.date(),
  reason: z
    .string()
    .min(2, "Reason must be at least 2 characters")
    .max(500, "Reason must be at most 500 characters"),
  note: z.string().optional(),
  status:  z.string().optional(),
  cancellationReason: z.string().optional(),
});

export const ScheduleAppointmentSchema = z.object({
  doctor: z.string().min(2, "Select at least one doctor"),
  date: z.coerce.date(),
  reason: z
    .string()
    .min(2, "Reason must be at least 2 characters")
    .max(500, "Reason must be at most 500 characters"),
  note: z.string().optional(),
  status:  z.string().optional(),
  cancellationReason: z.string().optional(),
});

export const CancelAppointmentSchema = z.object({
  doctor: z.string().min(2, "Select at least one doctor"),
  date: z.coerce.date(),
  reason: z.string().optional(),
  note: z.string().optional(),
  status:  z.string().optional(),
  cancellationReason: z
    .string()
    .min(2, "Reason must be at least 2 characters")
    .max(500, "Reason must be at most 500 characters"),
});

export function getAppointmentSchema(type: string) {
  switch (type) {
    case "create":
      return CreateAppointmentSchema;
    case "cancel":
      return CancelAppointmentSchema;
    default:
      return ScheduleAppointmentSchema;
  }
}