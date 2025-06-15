"use client"
 // Trang đăng kí user mới
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Form, FormControl } from "@/components/ui/form"
import CustomFormField from "../CustomFormField"
import SubmitButton from "../SubmitButton"
import { useState } from "react"
import { UserFormValidation } from "@/lib/validation"
import { useRouter } from "next/navigation"
import { FormFieldType } from "./PatientForm"
import { Role } from "@/constants"
import { createAccount , createUser} from "@/lib/actions/user.action"
import { SelectItem } from "../ui/select"
import toast from "react-hot-toast";
const CreateEmployeeForm = () => {
  const router = useRouter();
  const [isLoading, setisLoading] = useState(false);
 
  const form = useForm<z.infer<typeof UserFormValidation>>({
    resolver: zodResolver(UserFormValidation),
    defaultValues: {
      email: "",
      password: "",
      name: "",
      username:"",
      phone:"",
      role:"",
      address:""
    },
  })
 

  const [accountId, setAccountId] = useState<string | null>(null); 


  async function onSubmit(values: z.infer<typeof UserFormValidation>) {
   

    setisLoading(true);

    try {
      const accountData = {
      email: values.email,
      password: values.password,
    };

    const newAccount = await createAccount(accountData);

    if (newAccount) {
      setAccountId(newAccount._id); 
    }
 
    const UserData = {
      accountId:accountId?.toString(), 
      name: values.name,
      username: values.username,
      role:values.role,
      phone: values.phone,
      address: values.address,
    };

    const newUser = await createUser(UserData);

    if (newUser) {
      router.refresh();
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
    <Form {...form}>
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2 flex-1 w-full max-w-[500px]" >  
    <CustomFormField
        fieldType = {FormFieldType.INPUT}
        control = {form.control}
        name = 'email'
        label = 'Email'
        placeholder = 'Enter email'
        iconSrc = '/assets/icons/mail.png'
        iconAlt = 'email'
      />


      <CustomFormField
        fieldType = {FormFieldType.PASSWORD}
        control = {form.control}
        name = 'password'
        label= 'Password'
        placeholder = 'Enter password'
        iconSrc = '/assets/icons/key.png'
        iconAlt = 'password'
      />
    <div className="flex flex-col gap-6 xl:flex-row">
      <CustomFormField
          fieldType = {FormFieldType.INPUT}
          control = {form.control}
          name = 'name'
          label = 'Name'
          placeholder = 'Enter name'
          iconSrc = '/assets/icons/user.png'
          iconAlt = 'name'
        />

        <CustomFormField
          fieldType = {FormFieldType.INPUT}
          control = {form.control}
          name = 'username'
          label = 'User name'
          placeholder = 'Enter username'
          iconSrc = '/assets/icons/user.png'
          iconAlt = 'username'
        />
      </div>
      <CustomFormField
            fieldType={FormFieldType.SELECT}
            control={form.control}
            name='role'
            label='Role'
            placeholder='Select a role'
          >
            {Role.map((role) => (
              <SelectItem
                key={role.name}
                value={role.name} 
              >
                <div className="flex items-center gap-2 cursor-pointer">
                  <p>{role.name}</p>
                </div>
              </SelectItem>
            ))}
          </CustomFormField>
            <CustomFormField
              fieldType = {FormFieldType.PHONE_INPUT}
              control = {form.control}
              name = 'phone'
              label = 'Phone number'
              placeholder = '(84+) 913 834 393'
            />
            <CustomFormField
                fieldType = {FormFieldType.INPUT}
                control = {form.control}
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