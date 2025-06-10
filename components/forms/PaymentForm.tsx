"use client"
// Trang đăng kí user mới
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Form, FormControl } from "@/components/ui/form"
import CustomFormField from "../CustomFormField"
import SubmitButton from "../SubmitButton"
import { useState } from "react"
import { PatientRegisterFormValidation } from "@/lib/validation"
import { useRouter } from "next/navigation"
import { registerPatient } from "@/lib/actions/patient.actions"
import { FormFieldType } from "./PatientForm"
import { RadioGroup, RadioGroupItem } from "../ui/radio-group"
import { Doctors, GenderOptions, PaymentOptions } from "@/constants"
import { Label } from "../ui/label"
import toast from "react-hot-toast"

const PaymentForm = () => {
  const router = useRouter();
  const [isLoading, setisLoading] = useState(false);
  const form = useForm<z.infer<typeof PatientRegisterFormValidation>>({
    resolver: zodResolver(PatientRegisterFormValidation),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      birthdate: new Date(Date.now()),
      gender: "male" as Gender,
      address: "",
    },
  })


  async function onSubmit(values: z.infer<typeof PatientRegisterFormValidation>) {
    setisLoading(true);

    try {
      const cleanedPhone = values.phone.startsWith('+84')
        ? '0' + values.phone.slice(3)
        : values.phone;
      const patientData = {
        ...values,
        phone: cleanedPhone,
        birthdate: new Date(values.birthdate),
      };
      // Gọi action Mongoose trực tiếp
      const newPatient = await registerPatient(patientData);

      if (newPatient) {
        router.push(`/patient/${newPatient._id}/appointment`);
      }
    } catch (error) {
      console.error('Lỗi đăng ký:', error);
      form.setError('root', {
        type: 'manual',
        message: error instanceof Error ? error.message : 'Lỗi đăng ký',
      });
    } finally {
      setisLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 flex-1">
        <section className="space-y-4">
          <h1 className="header">Please choose your payment method</h1>

        </section>

          <CustomFormField
            fieldType={FormFieldType.SKELETON}
            control={form.control}
            name='paymentMethod'
            label='Payment Method'
            renderSkeleton={(field) => (
              <FormControl>
                <RadioGroup className="flex h-11 gap-6 xl:jusutify-between"
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  {PaymentOptions.map((option) => (
                    <div key={option} className="radio-group">
                      <RadioGroupItem value={option} id={option} />
                      <Label htmlFor={option} className="cursor-pointer">
                        {option}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </FormControl>
            )}
          />
        <SubmitButton isLoading={isLoading}>Confirm</SubmitButton>
      </form>
    </Form>
  )
}

export default PaymentForm