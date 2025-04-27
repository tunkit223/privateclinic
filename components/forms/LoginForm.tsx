"use client"
// Trang đăng kí user mới
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Form, FormControl } from "@/components/ui/form"
import CustomFormField from "../CustomFormField"
import SubmitButton from "../SubmitButton"
import { useState } from "react"
import { PatientFormValidation, AccountFormValidation, LoginFormValidation } from "@/lib/validation"
import { useRouter } from "next/navigation"
import { registerPatient } from "@/lib/actions/patient.actions"
import { FormFieldType } from "./PatientForm"
import { RadioGroup, RadioGroupItem } from "../ui/radio-group"
import { Doctors, GenderOptions } from "@/constants"
import { Label } from "../ui/label"
import { loginAccount } from "@/lib/actions/login.actions"
import toast from "react-hot-toast"

const LoginForm = () => {
  const router = useRouter();
  const [isLoading, setisLoading] = useState(false);
  const form = useForm<z.infer<typeof LoginFormValidation>>({
    resolver: zodResolver(LoginFormValidation),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  async function onSubmit(values: z.infer<typeof LoginFormValidation>) {
    setisLoading(true);
    try {
      const accountData = {
        email: values.email,
        password: values.password
      };

      const loginsuccess = await loginAccount(accountData);
      console.log(loginsuccess);

      if (loginsuccess) {
        router.push(`${loginsuccess._id}`);
        toast.success("Login successfully.", {
          position: "top-left",
          duration: 3000,
        });
      } else {
        toast.error("Login fail.", {
          position: "top-left",
          duration: 3000,
        });
      }

    } catch (error) {
      toast.error("Wrong email or password.", {
        position: "top-left",
        duration: 3000,
      });
    } finally {
      setisLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 flex-1 w-full max-w-[500px]" >


        <section className="space-y-6">
          <div className="mb-9 space-y-1">
            <h1 className="sub-header">Login now</h1>
          </div>
        </section>



        <CustomFormField
          fieldType={FormFieldType.INPUT}
          control={form.control}
          name='email'
          label='Email'
          placeholder='Enter your email'
          iconSrc='/assets/icons/mail.png'
          iconAlt='email'
        />


        <CustomFormField
          fieldType={FormFieldType.PASSWORD}
          control={form.control}
          name='password'
          label='Password'
          placeholder='Enter your password'
          iconSrc='/assets/icons/key.png'
          iconAlt='password'
        />

        <SubmitButton isLoading={isLoading}>Login</SubmitButton>
      </form>
    </Form>
  )
}

export default LoginForm