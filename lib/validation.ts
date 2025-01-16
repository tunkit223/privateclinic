import { z } from "zod";

export const UserFormValidation = z.object({
  name: z.string()
    .min(1, "Username must be at least 1 characters.")
    .max(50, "Username must be at most 2 characters."),
  email: z.string().email("Invalid email address."),
  // phone: z.string().refine((phone)=>/^\d{10}$/.test(phone), 'Invalid phone number'),
})
 