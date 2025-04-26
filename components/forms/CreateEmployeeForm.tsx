"use client"
 // Trang đăng kí user mới
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Form, FormControl } from "@/components/ui/form"
import CustomFormField from "../CustomFormField"
import SubmitButton from "../SubmitButton"
import { useState } from "react"
import { PatientFormValidation, AccountFormValidation, UserFormValidation } from "@/lib/validation"
import { useRouter } from "next/navigation"
import { registerPatient } from "@/lib/actions/patient.actions"
import { FormFieldType } from "./PatientForm"
import { RadioGroup, RadioGroupItem } from "../ui/radio-group"
import { Doctors, GenderOptions, Tag } from "@/constants"
import { Label } from "../ui/label"
import { createAccount , createUser} from "@/lib/actions/user.action"
import { SelectItem } from "../ui/select"
import Image from "next/image"
import mongoose from "mongoose";
import toast from "react-hot-toast";
const CreateEmployeeForm = () => {
  const router = useRouter();
  const [isLoading, setisLoading] = useState(false);
  const form1 = useForm<z.infer<typeof AccountFormValidation>>({
    resolver: zodResolver(AccountFormValidation),
    defaultValues: {
      email: "",
      password:""
    },
  })
  const form2 = useForm<z.infer<typeof UserFormValidation>>({
    resolver: zodResolver(UserFormValidation),
    defaultValues: {
      name: "",
      username:"",
      phone:"",
      address:""
    },
  })
 

  const [accountId, setAccountId] = useState<string | null>(null); // State lưu _id

async function onSubmit1(values: z.infer<typeof AccountFormValidation>) {
  setisLoading(true);

  try {
    const accountData = {
      email: values.email,
      password: values.password,
      tag: values.tag,
    };

    const newAccount = await createAccount(accountData);

    if (newAccount) {
      toast.success("Create account successfully.", {
        position: "top-left",
        duration: 3000,
      });
      setAccountId(newAccount._id); // Lưu _id vào state
    }
  } catch (error) {
    toast.error("Create account fail.", {
      position: "top-left",
      duration: 3000,
    });
    form1.reset()
    setisLoading(false);
  } finally {
    setisLoading(false);
  }
}

  async function onSubmit2(values: z.infer<typeof UserFormValidation>) {
    if (!accountId) {
      toast.error("Please create account first.", {
        position: "top-left",
        duration: 3000,
      });
      return;
    }

    setisLoading(true);

    try {
    const UserData = {
      accountId:accountId.toString(), // Lấy accountId từ state
      name: values.name,
      username: values.username,
      phone: values.phone,
      address: values.address,
    };

    const newUser = await createUser(UserData);

    if (newUser) {
      toast.success("Create user successfully.", {
        position: "top-left",
        duration: 3000,
      });
    }
  } catch (error) {
    toast.error("Create user fail.", {
      position: "top-left",
      duration: 3000,
    });
  } finally {
    setisLoading(false);
  }
}


  return (
    <Form {...{ ...form1, ...form2 }}>
    <form onSubmit={form1.handleSubmit(onSubmit1)} className="space-y-2 flex-1 w-full max-w-[500px]" >  
    <CustomFormField
        fieldType = {FormFieldType.INPUT}
        control = {form1.control}
        name = 'email'
        label = 'Email'
        placeholder = 'Enter email'
        iconSrc = '/assets/icons/mail.png'
        iconAlt = 'email'
      />


      <CustomFormField
        fieldType = {FormFieldType.PASSWORD}
        control = {form1.control}
        name = 'password'
        label= 'Password'
        placeholder = 'Enter password'
        iconSrc = '/assets/icons/key.png'
        iconAlt = 'password'
      />
       <CustomFormField
              fieldType={FormFieldType.SELECT}
              control={form1.control}
              name='tag'
              label='Tag'
              placeholder='Select a tag'
            >
              {Tag.map((tag) => (
                <SelectItem
                  key={tag.name}
                  value={tag.name}
                  onClick={() => form1.setValue("tag", tag.name)}>
                  <div className="flex items-center gap-2 cursor-pointer">
                    <p>
                      {tag.name}
                    </p>
                  </div>
                </SelectItem>))}
            </CustomFormField>

      <SubmitButton isLoading={isLoading}>Create account</SubmitButton>
    </form>

    <form onSubmit={form2.handleSubmit(onSubmit2)} className="space-y-2 flex-1 w-full max-w-[500px]" >  
    <div className="flex flex-col gap-6 xl:flex-row">
      <CustomFormField
          fieldType = {FormFieldType.INPUT}
          control = {form2.control}
          name = 'name'
          label = 'Name'
          placeholder = 'Enter name'
          iconSrc = '/assets/icons/user.png'
          iconAlt = 'name'
        />

        <CustomFormField
          fieldType = {FormFieldType.INPUT}
          control = {form2.control}
          name = 'username'
          label = 'User name'
          placeholder = 'Enter username'
          iconSrc = '/assets/icons/user.png'
          iconAlt = 'username'
        />
      </div>
            <CustomFormField
              fieldType = {FormFieldType.PHONE_INPUT}
              control = {form2.control}
              name = 'phone'
              label = 'Phone number'
              placeholder = '(84+) 913 834 393'
            />
            <CustomFormField
                fieldType = {FormFieldType.INPUT}
                control = {form2.control}
                name = 'address'
                label = 'Address'
                placeholder = 'Linh Trung ward, Thu Đuc, Ho Chi Minh city'
            />
      <SubmitButton isLoading={isLoading}>Add employee</SubmitButton>
    </form>
  </Form>

  
  )
}

export default CreateEmployeeForm