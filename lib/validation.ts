import { z } from "zod";

export const UserFormValidation = z.object({
  name: z.string()
    .min(1, "Username must be at least 1 characters.")
    .max(50, "Username must be at most 2 characters."),
  email: z.string().email("Invalid email address."),
  phone: z.string().refine((phone)=>/^((\+84|0)[3|5|7|8|9])+([0-9]{8})$/.test(phone), 'Invalid phone number'),
})
 