"use client"
import { createMedicalReportFormValidation } from '@/lib/validation'
import { zodResolver } from '@hookform/resolvers/zod'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Form, FormControl } from "@/components/ui/form"
import { z } from 'zod'
import CustomFormField from '../CustomFormField'
import { FormFieldType } from './PatientForm'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { Diseasetype, Unit, Usage } from '@/constants'
import SubmitButton from '../SubmitButton'
import { addMedicine, getMedicineByName, getMedicinePriceByAmount, validateMedicine } from '@/lib/actions/medicine.action'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'
import { getAppointmentDetails } from '@/lib/actions/appointment.action'
import { addMedicalReport, addMedicalReportDetail } from '@/lib/actions/medicalReport.action'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Input } from "@/components/ui/input";
type MedicineRow = {
  Name: string;
  Unit: string;
  Amount: string;
  Usage: string;
};
const MedicalReportForm = ({appointmentId}:{appointmentId: string}) => {
      const router = useRouter();
      const [isLoading, setisLoading] = useState(false);
      const form = useForm<z.infer<typeof createMedicalReportFormValidation>>({
      resolver: zodResolver(createMedicalReportFormValidation),
      defaultValues: {
       appointmentId: appointmentId,
       name: "",
       date: new Date(),
       symptom: "",
       diseaseType:"",
      },
    })
    useEffect(() => {
      const fetchAppointmentDetails = async () => {
        const data = await getAppointmentDetails(appointmentId);
        if (data) {
          form.setValue("name", data.patientName);
          form.setValue("date", new Date(data.appointmentDate));
        }
      };
    
      fetchAppointmentDetails();
    }, [appointmentId]);

    
    const [data, setData] = useState<MedicineRow[]>([
    { Name: "", Unit: "", Amount:"", Usage:"" },
    { Name: "", Unit: "", Amount:"", Usage:"" },
    { Name: "", Unit: "", Amount:"", Usage:"" }
    ]);
    useEffect(() => {
      const lastRow = data[data.length - 1];
      const allFieldsFilled = lastRow.Name && lastRow.Unit && lastRow.Amount && lastRow.Usage;

      if (allFieldsFilled) {
        setData((prev) => [
          ...prev,
          { Name: "", Unit: "", Amount: "", Usage: "" },
        ]);
      }
    }, [data]);
   const handleChange = (
      index: number,
      field: keyof MedicineRow,
      value: string
    ) => {
      const newData = [...data];
      newData[index][field] = value;
      setData(newData);
    };

   async function onSubmit(values: z.infer<typeof createMedicalReportFormValidation>){
    setisLoading(true);
    try {
      for (const [index, item] of data.entries()) {
      if (item.Name && item.Amount) {
        const medicine = await validateMedicine(item.Name);
        if (!medicine) {
          toast.error(`Thuốc ở dòng ${index + 1} không tồn tại: ${item.Name}`, { position: "top-left" });
          setisLoading(false);
          return;
        }
     
        if (medicine !== item.Unit) {
          toast.error(`Unit của thuốc "${item.Name}" ở dòng ${index + 1} không đúng. Phải là "${medicine}"`, { position: "top-left" });
          setisLoading(false);
          return;
        }
        const amount = parseInt(item.Amount, 10);
        if (isNaN(amount) || amount <= 0) {
          toast.error(`Amount ở dòng ${index + 1} không hợp lệ. Vui lòng nhập một số nguyên dương.`, { position: "top-left" });
          setisLoading(false);
          return;
        }
      }
    }

      const medicalReportData ={
        appointmentId: appointmentId,
        symptom: values.symptom,
        diseaseType: values.diseaseType,
      }
      const newmedicalReport= await addMedicalReport(medicalReportData);
      
      if(newmedicalReport){
        router.refresh();
        toast.success("Add medical report successfully.", {
          position: "top-left",
          duration: 3000,
        });

        const medicalReportId = newmedicalReport._id.toString();

      // Duyệt thuốc và chuẩn bị data
      const detailList = await Promise.all(
        data
          .filter((item) => item.Name && item.Amount) 
          .map(async (item) => {
            const medicineId = await getMedicineByName(item.Name);
           
            return {
              medicalReportId,
              medicineId,
              amount: parseInt(item.Amount, 10),
              usage: item.Usage,
              price: parseInt(await getMedicinePriceByAmount(item.Name, parseInt(item.Amount, 10))),
            }
          })
      );  
          await addMedicalReportDetail(detailList);
      }
      else{
        toast.error("Cannot add medical report (appointment had been finished or cancelled).", {
          position: "top-left",
          duration: 3000,
        });
      }
    } catch (error) {
      console.log(error)
    }
    setisLoading(false);
    form.reset();
   }
  return (
    <Form {...form}>
       <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2 flex-1 w-full max-w-[800px]" >
       <section className="mb-12 space-y-4">
          <h1 className="header">Finish Appointment</h1>
          <p className="text-dark-600">Fill in the Medical Report</p>
        </section>
        <div className='flex flex-row gap-4'>
       <CustomFormField
          fieldType = {FormFieldType.INPUT}
          control = {form.control}
          name = 'name'
          label = 'Name'
          placeholder = 'Enter patient name'
          iconAlt = 'pill'
        />
        
        <CustomFormField
          fieldType={FormFieldType.DATE_PICKER}
          control={form.control}
          name="date"
          label='Appointment date'
          showTimeSelect
          dateFormat="dd/MM/yyyy - h:mm aa"
        />
        </div>
          <div className='flex flex-row gap-4'>
        <CustomFormField
          fieldType = {FormFieldType.INPUT}
          control = {form.control}
          name = 'symptom'
          label = 'Symptom'
          placeholder = 'Enter symptom'
          iconAlt = 'symptom'
        />
        <CustomFormField
                      fieldType={FormFieldType.SELECT}
                      control={form.control}
                      name='diseaseType'
                      label='Disease Type'
                      placeholder='Select a disease type'
                    >
                      {Diseasetype.map((type) => (
                        <SelectItem
                          key={type.name}
                          value={type.name}
                          onClick={() => form.setValue("diseaseType", type.name)}>
                          <div className="flex items-center gap-2 cursor-pointer">
                            <p>
                              {type.name}
                            </p>
                          </div>
                        </SelectItem>))}
                    </CustomFormField>
          </div>

        <Table className='shad-table'>
            <TableHeader className="bg-blue-400">
              <TableRow className="shad-table-row-header">
                <TableHead className="w-8 text-center">STT</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Unit</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Usage</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((row, index) => (
                <TableRow key={index}   className="shad-table-row">

                  <TableCell className="text-center">{index + 1}</TableCell>

                  <TableCell>
                    <Input
                      value={row.Name}
                      onChange={(e) => handleChange(index, "Name", e.target.value)}
                      className='border-black'
                    />
                  </TableCell>

                  <TableCell>
                   <Select
                      value={row.Unit}
                      onValueChange={(value) => handleChange(index, "Unit", value)}
                    >
                      <SelectTrigger className="border-black h-9">
                        <SelectValue placeholder="Select unit" />
                      </SelectTrigger>
                      <SelectContent className="border-black bg-blue-200">
                        {Unit.map((tag) => (
                          <SelectItem key={tag.name} value={tag.name}>
                            <div className="flex items-center gap-2 cursor-pointer">
                              <p>{tag.name}</p>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>

                  <TableCell>
                    <Input
                      value={row.Amount}
                      onChange={(e) => handleChange(index, "Amount", e.target.value)}
                      className='border-black'
                    />
                  </TableCell>

                  <TableCell>
                    <Select
                      value={row.Usage}
                      onValueChange={(value) => handleChange(index, "Usage", value)}
                    >
                      <SelectTrigger className="border-black h-9">
                        <SelectValue placeholder="Select usage" />
                      </SelectTrigger>
                      <SelectContent className="border-black bg-blue-200">
                        {Usage.map((usage) => (
                          <SelectItem key={usage.name} value={usage.name}>
                            <div className="flex items-center gap-2 cursor-pointer">
                              <p>{usage.name}</p>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    
                  </TableCell>

                </TableRow>
              ))}
            </TableBody>
          </Table>
        

         <SubmitButton isLoading={isLoading}>Create Medical Report</SubmitButton>
        </form>  
    </Form>
  )
}

export default MedicalReportForm