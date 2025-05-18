"use client"
 // Trang đăng kí user mới
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Form, FormControl } from "@/components/ui/form"
import CustomFormField from "../CustomFormField"
import SubmitButton from "../SubmitButton"
import { useState } from "react"
import { PatientFormValidation } from "@/lib/validation"
import { useRouter } from "next/navigation"
import { registerPatient } from "@/lib/actions/patient.actions"
import { FormFieldType } from "./PatientForm"
import { RadioGroup, RadioGroupItem } from "../ui/radio-group"
import { Doctors, GenderOptions } from "@/constants"
import { Label } from "../ui/label"

const RegisterForm = () => {
  const router = useRouter();
  const [isLoading, setisLoading] = useState(false);
  const form = useForm<z.infer<typeof PatientFormValidation>>({
    resolver: zodResolver(PatientFormValidation),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      birthdate: new Date(Date.now()),
      gender: "male" as Gender,
      address: "",
    },
  })
 

  async function onSubmit(values: z.infer<typeof PatientFormValidation>) {
    setisLoading(true);

  try {
    const patientData = {
      ...values,
      birthDate: new Date(values.birthdate), 

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
          <h1 className="header">Welcome👋</h1>
          <p className="text-dark-400">Let us know more about yourself.</p>
      </section>
      
      <section className="space-y-6">
         <div className="mb-9 space-y-1">
         <h2 className="sub-header">Personal Infomation</h2>
         </div>
      </section>

      <CustomFormField
        fieldType = {FormFieldType.INPUT}
        control = {form.control}
        name = 'name'
        label= 'Full name'
        placeholder = 'Your full name'
        iconSrc = '/assets/icons/user.png'
        iconAlt = 'user'
      />
      
    <div className="flex flex-col gap-6 xl:flex-row">
      <CustomFormField
        fieldType = {FormFieldType.INPUT}
        control = {form.control}
        name = 'email'
        label = 'Email'
        placeholder = 'tunkit223@gmail.com'
        iconSrc = '/assets/icons/mail.png'
        iconAlt = 'email'
      />

      <CustomFormField
        fieldType = {FormFieldType.PHONE_INPUT}
        control = {form.control}
        name = 'phone'
        label = 'Phone number'
        placeholder = '(84+) 913 834 393'
      />
    </div>

    <div className="flex flex-col gap-6 xl:flex-row">
      <CustomFormField
        fieldType = {FormFieldType.DATE_PICKER}
        control = {form.control}
        name = 'birthdate'
        label = 'Date of Birth'
      />

      <CustomFormField
        fieldType = {FormFieldType.SKELETON}
        control = {form.control}
        name = 'gender'
        label = 'Gender'
        renderSkeleton={(field) => (
          <FormControl>
            <RadioGroup className="flex h-11 gap-6 xl:jusutify-between"
            onValueChange={field.onChange}
            defaultValue={field.value}
            >
              {GenderOptions.map((option)=>(
                <div key={option} className="radio-group">
                    <RadioGroupItem value={option} id={option}/>
                    <Label htmlFor={option} className="cursor-pointer">
                      {option}
                    </Label>
                </div>
              ))}
            </RadioGroup>
          </FormControl>
        )}
      />
    </div>

    <div className="flex flex-col gap-6 xl:flex-row">
      <CustomFormField
          fieldType = {FormFieldType.INPUT}
          control = {form.control}
          name = 'address'
          label = 'Address'
          placeholder = 'Linh Trung ward, Thu Đuc, Ho Chi Minh city'
      />
    </div>
      <SubmitButton isLoading={isLoading}>Submit</SubmitButton>
    </form>
  </Form>
  )
}

export default RegisterForm