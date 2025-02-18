"use client"
 // Trang đăng kí user mới
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { set, z } from "zod"
import { Form, FormControl } from "@/components/ui/form"
import CustomFormField from "../CustomFormField"
import SubmitButton from "../SubmitButton"
import { useState } from "react"
import { PatientFormValidation, UserFormValidation } from "@/lib/validation"
import { useRouter } from "next/navigation"
import { registerPatient } from "@/lib/actions/patient.actions"
import { FormFieldType } from "./PatientForm"
import { RadioGroup, RadioGroupItem } from "../ui/radio-group"
import { Doctors, GenderOptions, PatientFormDefaultValues } from "@/constants"
import { Label } from "../ui/label"
import { SelectItem } from "../ui/select"
import Image from "next/image"
import FileUploader from "../FileUploader"


 
const RegisterForm = ({user}: {user: User}) => {
  const router = useRouter();
  const [isLoading, setisLoading] = useState(false);
  const form = useForm<z.infer<typeof PatientFormValidation>>({
    resolver: zodResolver(PatientFormValidation),
    defaultValues: {
      ...PatientFormDefaultValues,
      name: "",
      email: "",
      phone: "",
    },
  })
 
 
  async function onSubmit(values: z.infer<typeof PatientFormValidation>) {
    setisLoading(true);

    let formData;

    if(values.identificationDocument && values.identificationDocument.length > 0){
        const blobFile = new Blob([values.identificationDocument[0]], {
          type: values.identificationDocument[0].type,
        })

        formData = new FormData();
        formData.append('blobFile', blobFile);
        formData.append('fileName', values.identificationDocument[0].name);
    }

    try {
     const patientData = {
      ...values,
      userId: user.$id,
      birthDate: new Date(values.birthDate),
      identificationDocument: formData,
     }
      // @ts-ignore
      const patient = await registerPatient(patientData);

      if (patient) router.push(`/patients/${user.$id}/new-appointment`);

    } catch (error) {
      console.log(error);
    } 
    setisLoading(false);
  }
  
  return (
    <Form {...form}>
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 flex-1">
      <section className="space-y-4">
          <h1 className="header">Welcome👋</h1>
          <p className="text-dark-700">Let us know more about yourself.</p>
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
        placeholder = 'キエト'
        iconSrc = '/assets/icons/user.svg'
        iconAlt = 'user'
      />
      
    <div className="flex flex-col gap-6 xl:flex-row">
      <CustomFormField
        fieldType = {FormFieldType.INPUT}
        control = {form.control}
        name = 'email'
        label = 'Email'
        placeholder = 'tunkit223@gmail.com'
        iconSrc = '/assets/icons/email.svg'
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
        name = 'birthDate'
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

      <CustomFormField
          fieldType = {FormFieldType.INPUT}
          control = {form.control}
          name = 'occupation'
          label = 'Occupation'
          placeholder = 'Sofeware Engineer'
      />
    </div>

    <div className="flex flex-col gap-6 xl:flex-row">
      <CustomFormField
          fieldType = {FormFieldType.INPUT}
          control = {form.control}
          name = 'emergencyContactName'
          label = 'Emergency Contact Name'
          placeholder = 'GurdianName'
        />

        <CustomFormField
          fieldType = {FormFieldType.PHONE_INPUT}
          control = {form.control}
          name = 'emergencyContactNumber'
          label = 'Emergency Contact Number'
          placeholder = '(84+) 913 834 393'
        />
    </div>

     <section className="space-y-6">
         <div className="mb-9 space-y-1">
         <h2 className="sub-header">Medical Infomation</h2>
         </div>
      </section>

      <CustomFormField
          fieldType = {FormFieldType.SELECT}
          control = {form.control}
          name = 'primaryPhysician'
          label = 'Primary Physician'
          placeholder = 'Select a phyician'
      >
        {Doctors.map((doctor)=>(
          <SelectItem 
            key={doctor.name} 
            value={doctor.name}>
            <div className="flex items-center gap-2 cursor-pointer">
              <Image
                src={doctor.image}
                alt={doctor.name}
                width={32}
                height={32}
                className="rounded-full border border-dark-200"
                />
                <p>
                  {doctor.name}
                </p>
            </div>
          </SelectItem>))}
      </CustomFormField>
      
    <div className="flex flex-col gap-6 xl:flex-row">
      <CustomFormField
            fieldType = {FormFieldType.INPUT}
            control = {form.control}
            name = 'insuranceProvider'
            label = 'Insurance Provider'
            placeholder = 'Pacific Cross Viet Nam'
        />

        <CustomFormField
            fieldType = {FormFieldType.INPUT}
            control = {form.control}
            name = 'insurancePolicyNumber'
            label = 'Insurance Policy Number'
            placeholder = 'HS-4-54-5420975080'
        />
    </div>


    <div className="flex flex-col gap-6 xl:flex-row">
      <CustomFormField
            fieldType = {FormFieldType.TEXTAREA}
            control = {form.control}
            name = 'allergies'
            label = 'Allergies (if any)'
            placeholder = 'Egg, Milk, SeaFood, Flower, ...'
        />

        <CustomFormField
            fieldType = {FormFieldType.TEXTAREA}
            control = {form.control}
            name = 'currentMedication'
            label = 'Current Medication (if any)'
            placeholder = 'Ibuprofen 200g, Paracetamol 500g, ...'
        />
    </div>


    <div className="flex flex-col gap-6 xl:flex-row">
      <CustomFormField
            fieldType = {FormFieldType.TEXTAREA}
            control = {form.control}
            name = 'familyMedicalHistory'
            label = 'Family Medical History'
            placeholder = 'Anemia, cancer, diabetes, ...'
        />

        <CustomFormField
            fieldType = {FormFieldType.TEXTAREA}
            control = {form.control}
            name = 'pastMedicalHistory'
            label = 'Past Medical History'
            placeholder = 'Appendectomy, Tonsillectomy ...'
        />
    </div>

    <section className="space-y-6">
         <div className="mb-9 space-y-1">
         <h2 className="sub-header">Identification and Verification</h2>
         </div>
    </section>
    
    <CustomFormField
            fieldType = {FormFieldType.INPUT}
            control = {form.control}
            name = 'identityCard(CCCD)'
            label = 'Identity Card Number(CCCD)'
            placeholder = '054205002040'
        />

    <CustomFormField
        fieldType = {FormFieldType.SKELETON}
        control = {form.control}
        name = 'identityCardPicture(CCCD)'
        label = 'Identity Card Picture(CCCD)'
        renderSkeleton={(field) => (
          <FormControl>
              <FileUploader files={field.value} onChange={field.onChange}/>
          </FormControl> 
        )}
      />
        
        <section className="space-y-6">
          <div className="mb-9 space-y-1">
          <h2 className="sub-header">Consent and Privacy</h2>
          </div>
        </section>

        <CustomFormField
          fieldType={FormFieldType.CHECKBOX}
          control={form.control}
          name="treatmentConsent"
          label="I consent to treatment"
        />
        <CustomFormField
          fieldType={FormFieldType.CHECKBOX}
          control={form.control}
          name="disclosureConsent"
          label="I consent to disclosure of information"
        />
        <CustomFormField
          fieldType={FormFieldType.CHECKBOX}
          control={form.control}
          name="privacyConsent"
          label="I consent to privacy policy"
        />

      <SubmitButton isLoading={isLoading}>Get started</SubmitButton>
    </form>
  </Form>
  )
}

export default RegisterForm