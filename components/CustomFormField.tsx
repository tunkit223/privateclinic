'use client'
// Trang này để custom các field trong form, đa số dùng shadcn rồi gọi ra
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Control } from "react-hook-form"
import { FormFieldType } from "./forms/PatientForm"
import Image from "next/image"
import 'react-phone-number-input/style.css'
import PhoneInput from 'react-phone-number-input'
import { E164Number } from 'libphonenumber-js';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Select, SelectContent, SelectTrigger, SelectValue } from "./ui/select"
import { Textarea } from "./ui/textarea"
import { Checkbox } from "./ui/checkbox"
import { EyeIcon, EyeOffIcon } from "lucide-react"
import { useState } from "react"

interface CustomProps{
    control: Control<any>,
    fieldType: FormFieldType,
    name: string,
    label?: string,
    placeholder?:string,
    iconSrc?:string,
    iconAlt?:string,
    disabled?:boolean,
    dateFormat?:string,
    showTimeSelect?:boolean,
    children?:React.ReactNode,
    renderSkeleton?: (field:any) => React.ReactNode,
}

const RenderField = ({field, props}: {field:any; props: CustomProps}) =>{
  const { fieldType, 
          iconSrc, 
          iconAlt, 
          placeholder, 
          showTimeSelect, 
          dateFormat,
          renderSkeleton} = props;
    const isToday = (date: Date | null) => {
      if (!date) return false;
      const today = new Date();
      return (
        date.getDate() === today.getDate() &&
        date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear()
      );
    };

  switch(fieldType){
    case FormFieldType.INPUT:
      return(
        <div className="flex rounded-md border border-dark-500 bg-blue-200">
            {iconSrc && (
                <Image
                  src={iconSrc}
                  height={24}
                  width={24}
                  alt={iconAlt || 'icon'}
                  className='ml-2 object-contain'
                />
            )}
            <FormControl>
                <Input
                  placeholder={placeholder}
                  {...field}
                  className='shad-input border-0 '/>
                
            </FormControl>
        </div>
      )

    case FormFieldType.PHONE_INPUT:
        return(          
              <FormControl>
                  <PhoneInput
                    defaultCountry="VN"
                    placeholder={placeholder}
                    international
                    withCountryCallingCode
                    value={field.value as E164Number | undefined}
                    onChange={field.onChange}
                    className="input-phone"
                  />
              </FormControl>
      )

    case FormFieldType.DATE_PICKER:
  const isAppointment = props.name === 'date';
  const isBirthdate = props.name === 'birthdate';
  const now = new Date();

  return (
    <div className="flex rounded-md border border-dark-500 bg-blue-200">
      <Image
        src="/assets/icons/calendar.png"
        height={24}
        width={24}
        alt="calendar"
        className="ml-2 object-contain"
      />
      <FormControl>
        <DatePicker
          selected={field.value}
          onChange={(date) => field.onChange(date)}
          dateFormat={dateFormat ?? 'dd/MM/yyyy'}
          showTimeSelect={showTimeSelect ?? false}
          timeInputLabel="Time:"
          wrapperClassName="date-picker"
          minDate={isAppointment ? now : undefined}
          minTime={
            isAppointment && showTimeSelect
              ? isToday(field.value)
                ? now
                : new Date(new Date().setHours(7, 30, 0))
              : undefined
          }
          maxTime={
            isAppointment && showTimeSelect
              ? new Date(new Date().setHours(17, 0, 0))
              : undefined
          }
        />
      </FormControl>
    </div>
  );
    
    case FormFieldType.SELECT:
      return(
        <FormControl>
          <Select value={field.value} onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl >
                  <SelectTrigger className="shad-select-trigger">
                    <SelectValue placeholder={placeholder}/>   
                  </SelectTrigger>  
              </FormControl>

              <SelectContent className="shad-select-content">
                  {props.children}
              </SelectContent>
          </Select>
          </FormControl>   
      )

    case FormFieldType.TEXTAREA:
      return(
        <FormControl>
            <Textarea
              placeholder={placeholder}
              {...field}
              className="shad-textArea"
              disabled={props.disabled}
            />
        </FormControl>
      )

    case FormFieldType.SKELETON:
      return renderSkeleton ? renderSkeleton(field) : null
      
    case FormFieldType.CHECKBOX:
     return( <FormControl>
        <div className="flex items-center gap-4">
          <Checkbox
            id={props.name}
            checked={field.value}
            onCheckedChange={field.onChange}
          />
          <label htmlFor={props.name} 
          className="checkbox-label">
            {props.label}</label>
        </div>
      </FormControl>)
    case FormFieldType.PASSWORD:
      const [showPassword, setShowPassword] = useState(false);
    
      return (
        <div className="flex rounded-md border border-dark-500 bg-blue-200 items-center">
          {iconSrc && (
            <Image
              src={iconSrc}
              height={24}
              width={24}
              alt={iconAlt || 'icon'}
              className="ml-2"
            />
          )}
          <FormControl>
            <Input
              type={showPassword ? "text" : "password"}
              placeholder={placeholder}
              {...field}
              className="shad-input border-0 pr-10"
            />
          </FormControl>
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="mr-2"
          >
            {showPassword ? (
              <EyeOffIcon className="h-5 w-5 text-gray-500" />
            ) : (
              <EyeIcon className="h-5 w-5 text-gray-500" />
            )}
          </button>
        </div>
      );
    default:
      break;
  }
}

const CustomFormField = (props: CustomProps) => {
  const {control, fieldType, name, label} = props;
  return (
    <FormField
    control={control}
    name={name}
    render={({ field }) => (
      <FormItem className="flex-1">
          {fieldType !== FormFieldType.CHECKBOX && label && (
            <FormLabel>{label}</FormLabel>
          )}

          <RenderField field={field} props={props}/>  

          <FormMessage className="shad-error"/>
      </FormItem>
    )}
  />
  )
}

export default CustomFormField