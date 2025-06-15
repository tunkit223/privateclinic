"use client"
import { createMedicalReportFormValidation } from '@/lib/validation'
import { zodResolver } from '@hookform/resolvers/zod'
import React, { useEffect, useState } from 'react'
import { useFieldArray, useForm, useFormContext } from 'react-hook-form'
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
import { addMedicalReport, addMedicalReportDetail, getMedicalReportDetails, updateMedicalReport } from '@/lib/actions/medicalReport.action'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Input } from "@/components/ui/input";
import { getMedicalReportDetailsList } from '@/lib/actions/medicalRPdetails'
import { getPrescriptionByMedicalReportId, getPrescriptionDetailsByPrescriptionId } from '@/lib/actions/prescription.action'
import { getLatestSetting } from '@/lib/actions/setting.action'
type MedicineRow = {
  Name: string;
  Unit: string;
  Amount: string;
  Usage: string;
};
const MedicalReportForm = ({appointmentId,medicalReportIds,disabled}:{appointmentId: string, medicalReportIds: string,disabled?: boolean}) => {
      const router = useRouter();
      const [isLoading, setisLoading] = useState(false);
      const [diseaseTypeList, setDiseaseTypeList] = useState<string[]>([])
      useEffect(() => {
      const fetchSetting = async () => {
        const setting = await getLatestSetting();
        if (setting?.DiseaseType) {
          setDiseaseTypeList(setting.DiseaseType);
        }
      };
      fetchSetting();
    }, []);
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

    const [readonlyPrescription, setReadonlyPrescription] = useState<MedicineRow[]>([]);

    useEffect(() => {

  const fetchPrescription = async () => {
   
    const precriptionid = await getPrescriptionByMedicalReportId(medicalReportIds);
    const list = await getPrescriptionDetailsByPrescriptionId(precriptionid);
 
        if (list && list.length > 0) {
           setReadonlyPrescription(list);
        }
  };
  fetchPrescription();
}, [medicalReportIds]);

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

    
    useEffect(() => {
      const fetchMedicalReport = async () => {
        const data = await getMedicalReportDetails(medicalReportIds);
        if (data) {
          form.setValue("symptom", data.symptom || "");
          form.setValue("diseaseType", data.diseaseType || "");
        }
      };
      fetchMedicalReport();
    }, [medicalReportIds]);


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
      
      const success = await updateMedicalReport(medicalReportIds, 
           values.symptom,
          values.diseaseType
        );
  
      
      if(success){
        router.refresh();
        toast.success("Update medical report successfully.", {
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
          <h1 className="header">Update medical report</h1>
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
                      {diseaseTypeList.map((type) => (
                        <SelectItem
                          key={type}
                          value={type}
                          onClick={() => form.setValue("diseaseType", type)}
                        >
                          <div className="flex items-center gap-2 cursor-pointer">
                            <p>{type}</p>
                          </div>
                        </SelectItem>
                      ))}
                    </CustomFormField>
          </div>
        {readonlyPrescription.length > 0 && (
        <Table className='shad-table'>
            <TableHeader className="bg-blue-400">
              <TableRow className="shad-table-row-header">
                <TableHead className="w-8 text-center">STT</TableHead>
                <TableHead className='w-40'>Name</TableHead>
                <TableHead className='w-20'>Unit</TableHead>
                <TableHead className='w-20'>Amount</TableHead>
                <TableHead >Usage</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
             {readonlyPrescription.length > 0
              ? readonlyPrescription.map((row, index) => (
                  <TableRow key={index} className="shad-table-row">
                    <TableCell className="text-center">{index + 1}</TableCell>
                    <TableCell><Input value={row.Name} disabled /></TableCell>
                    <TableCell><Input value={row.Unit} disabled /></TableCell>
                    <TableCell><Input value={row.Amount} disabled /></TableCell>
                    <TableCell><Input value={row.Usage} disabled /></TableCell>
                  </TableRow>
                ))
            : data.map((row, index) => (
                <TableRow key={index} className="shad-table-row">
                  <TableCell className="text-center">{index + 1}</TableCell>
                  <TableCell>
                    <Input
                      value={row.Name}
                      onChange={(e) => handleChange(index, "Name", e.target.value)}
                      className='border-black'
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      value={row.Unit}
                      onChange={(e) => handleChange(index, "Unit", e.target.value)}
                      className='border-black'
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      value={row.Amount}
                      onChange={(e) => handleChange(index, "Amount", e.target.value)}
                      className='border-black'
                    />
                  </TableCell>
                  <TableCell>
                  <Input
                      value={row.Usage}
                      onChange={(e) => handleChange(index, "Usage", e.target.value)}
                      className='border-black'
                    />
                    </TableCell>
                </TableRow>
              ))}

            </TableBody>
          </Table>)}

         <SubmitButton isLoading={isLoading} disabled={disabled}>Update Medical Report</SubmitButton>
        </form>  
    </Form>
  )
}

export default MedicalReportForm