import { bigint, z } from "zod";
// Trang check các thuộc tính của user
export const AccountFormValidation = z.object({
  password: z.string()
    .min(6, "Password must be at least 6 characters.")
    .max(50, "Password must be at most 50 characters."),
  email: z.string().email("Invalid email address."),
  
})
export const VerifyEmailValidation = z.object({
  email: z.string().email("Invalid email address."),
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
  role: z.string()
    .min(1, "Role must be at least 1 property"),
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
  verifycode:z.string()
    .min(1, "Password must be at least 1 characters.")
})
.refine((data) => data.newpassword === data.newpasswordagain, {
  message: "Passwords do not match.",
  path: ["newpasswordagain"], // Hiển thị lỗi tại trường `newpasswordagain`
});

export const ChangePassFormValidation = z.object({
  newpassword: z.string()
    .min(6, "Password must be at least 6 characters.")
    .max(50, "Password must be at most 50 characters."),
  newpasswordagain:z.string()
    .min(6, "Password must be at least 6 characters.")
    .max(50, "Password must be at most 50 characters."),
  oldpassword:z.string()
    .min(1, "Password must be at least 1 characters.")
})
.refine((data) => data.newpassword === data.newpasswordagain, {
  message: "Passwords do not match.",
  path: ["newpasswordagain"], // Hiển thị lỗi tại trường `newpasswordagain`
});

export const PatientRegisterFormValidation = z.object({
  name: z
    .string()
    .min(1, "Name must be at least 1 characters")
    .max(50, "Name must be at most 50 characters"),
  email: z.string().email("Invalid email address"),
  phone: z
    .string()
    .refine((phone) => /^((\+84|0)[3|5|7|8|9])+([0-9]{8})$/.test(phone), 'Invalid phone number'),
    birthdate: z
    .coerce.date()
    .max(new Date(), { message: "Birthdate must be before today" })
    ,
  gender: z.enum(["Male", "Female", "Other"]),
  address: z
    .string()
    .min(5, "Address must be at least 5 characters")
    .max(500, "Address must be at most 500 characters"),

});
export const PatientEditFormValidation = z.object({
  name: z
    .string()
    .min(1, "Name must be at least 1 characters")
    .max(50, "Name must be at most 50 characters"),
  email: z.string().email("Invalid email address"),
  phone: z
    .string()
    .refine((phone) => /^((\+84|0)[3|5|7|8|9])+([0-9]{8})$/.test(phone), 'Invalid phone number'),
  birthdate: z.string()
    .refine(val => /^\d{4}-\d{2}-\d{2}$/.test(val), { message: "Invalid date format" })
    .refine(val => new Date(val) < new Date(), { message: "Birthdate must be before today" }),
  gender: z.enum(["Male", "Female", "Other"]),
  address: z
    .string()
    .min(5, "Address must be at least 5 characters")
    .max(500, "Address must be at most 500 characters"),

});
export const DetailsAppointmentFormValidation = z.object({
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

export const medicineFormSchema = z.object({
  name: z
    .string()
    .min(1, "Name must be at least 1 character")
    .max(50, "Name must be at most 50 characters"),
    
  medicineTypeId: z.string().min(1, "Medicine type is required"),
  unit: z.string().min(1, "Unit is required"),

  amount: z.string().refine(val => !isNaN(Number(val)) && Number(val) >= 0, {
    message: "Amount must be a valid number",
  }),

  price: z.string().refine(val => !isNaN(Number(val)) && Number(val) >= 0, {
    message: "Price must be a valid number",
  }),
});

export const addMedicineTypeFormValidation = z.object({
  name:z
  .string()
  .min(1, "Name must be at least 1 characters")
  .max(50, "Name must be at most 50 characters"),
  description: z.string()
})

export const createMedicalReportFormValidation = z.object({
  appointmentId:z.string(),
  name: z
    .string()
    .min(1, "Name must be at least 1 characters")
    .max(50, "Name must be at most 50 characters"),
  date:  z.coerce.date(),
  symptom: z.string(),
  diseaseType: z.string(),
})

