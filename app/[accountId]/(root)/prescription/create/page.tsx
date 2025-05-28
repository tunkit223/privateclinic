"use client"
import React, { useEffect, useState } from 'react';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Form, Input, InputNumber, Row, Space } from 'antd';
import { Select } from 'antd';
import { useRouter } from 'next/navigation';
import { getMedicineList } from '@/lib/actions/medicine.action';
import type { DefaultOptionType } from 'antd/es/select';
import { getPatientExaminedList, createPrescription } from "@/lib/actions/prescription.action";
import { getEmployeesList } from '@/lib/actions/employees.action';
import { IMedicine } from '@/lib/interfaces/medicine.interface';
import { IDoctor } from '@/lib/interfaces/doctor.interface';
import { PatientExamined } from '@/lib/interfaces/patientExamined.interface';
import { Create_EditPrescriptionPayload } from '@/lib/interfaces/create_editPrescriptionPayload.interface';

function CreatePrescription() {
  const router = useRouter();
  const [medicineList, setMedicineList] = useState<IMedicine[]>([]);
  const [patientExaminedList, setPatientExaminedList] = useState<PatientExamined[]>([]);
  const [doctorList, setDoctorList] = useState<IDoctor[]>([]);


  const [form] = Form.useForm();


  // Fetch patient examined
  useEffect(() => {
    const fetchPatient = async () => {
      try {
        const response = await getPatientExaminedList();
        setPatientExaminedList(response);
      } catch (err) {
        console.log("Error fetch patient:", err);
      }
    }
    fetchPatient();
  }, [])
  console.log("Patient", patientExaminedList);


  // Fetch medicine list
  useEffect(() => {
    const fetchMedicine = async () => {
      try {
        const response = await getMedicineList();
        setMedicineList(response.documents);
      } catch (err) {
        console.log("Error fetch medicine:", err);
      }
    }
    fetchMedicine();
  }, [])
  // console.log("MedicineList", medicineList);

  // Fetch doctor list 
  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        const response = await getEmployeesList();
        setDoctorList(response.documents);
      } catch (error) {
        console.log("Error fetch doctor in create prescription:", error);
      }
    }
    fetchDoctor();
  }, [])
  console.log("Doctor list:", doctorList);

  const onFinish = async (values: any) => {
    const selectedPatient = patientExaminedList.find(pt => pt.name === values.patientName);
    const prescriptionDetailsPrice = values.prescriptionDetails.map((item: any) => {
      const medicine = medicineList.find(med => med.name === item.name);
      return {
        ...item,
        price: medicine?.price || 0
      }
    })


    const payload: Create_EditPrescriptionPayload = {
      medicalReportId: selectedPatient?.medicalReportId || '',
      prescribeByDoctor: values.doctor,
      details: prescriptionDetailsPrice,
    }
    console.log("Payload to create prescription:", payload);
    try {
      const result = await createPrescription(payload);
    } catch (error) {
      console.log("Error create prescription:", error);
    }
  };

  const handleChangeSelectMedicine = (value: string, fieldName: number) => {
    const medicine = medicineList.find((medicine) => medicine.name === value);
    if (medicine) {
      const currentDetail = form.getFieldValue('prescriptionDetails') || [];
      currentDetail[fieldName] = {
        ...currentDetail[fieldName],
        unit: medicine.unit,
        medicineId: medicine._id,
      };
      form.setFieldsValue({ prescriptionDetails: currentDetail });
    }
  }


  return (
    <>
      <div >
        <Form
          form={form}
          initialValues={{ prescriptionDetails: [{}] }}
          name="dynamic_form_nest_item"
          onFinish={onFinish}
          autoComplete="on"
        >
          <div className='w-full mt-10 bg-white p-5 pb-10 rounded-lg shadow-md'>
            <div className='Header mb-5'>
              <div className='text-xl font-semibold'>Prescription information</div>
              <div >Fill out all the information below</div>
            </div>
            <div className='flex '>
              <Form.Item
                className='mr-[100px]'
                label="Patient name"
                name="patientName"
                layout='vertical'
                style={{ width: 500, minHeight: 40 }}
                rules={[{ required: true, message: 'Missing patient name' }]}
              >
                <Select
                  dropdownStyle={{ maxHeight: 200, overflow: 'auto' }}
                  placeholder="Select patient name"
                  showSearch
                  optionFilterProp="children"
                  filterOption={(input: string, option?: DefaultOptionType) => {
                    const label = option?.children;
                    if (typeof label === 'string') {
                      return (label as string).toLowerCase().includes(input.toLowerCase());
                    }
                    return false;
                  }
                  }>
                  {patientExaminedList && patientExaminedList.map((pt) => (
                    <Select.Option key={pt.patientId} value={pt.name} >
                      {pt.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item
                label="Doctor"
                name="doctor"
                layout='vertical'
                style={{ width: 500 }}
                rules={[{ required: true, message: 'Missing doctor' }]}
              >
                <Select placeholder="Select doctor"
                  dropdownStyle={{ maxHeight: 200, overflow: 'auto' }}
                  showSearch
                  optionFilterProp="children"
                  filterOption={(input: string, option?: DefaultOptionType) => {
                    const label = option?.children;
                    if (typeof label === 'string') {
                      return (label as string).toLowerCase().includes(input.toLowerCase());
                    }
                    return false;
                  }
                  }>
                  {doctorList && doctorList.map(dt => (
                    <Select.Option key={dt._id} value={dt._id}>
                      {dt.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </div>
          </div>

          <div className='w-full mt-10 bg-white p-5 rounded-lg shadow-md'>
            <div className='Header mb-5'>
              <div className='text-xl font-semibold'>Prescription details</div>
            </div>
            <Form.List name="prescriptionDetails">
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name, ...restField }) => (
                    <Space key={key} style={{ display: 'flex', marginBottom: 20, gap: 20, alignItems: "flex-end" }} >
                      <Form.Item
                        label="Medicine name"
                        layout='vertical'
                        style={{ width: 400, minHeight: 50 }}
                        {...restField}
                        name={[name, 'name']}
                        rules={[{ required: true, message: 'Missing medicine name' }]}
                      >
                        <Select
                          onChange={(value) => handleChangeSelectMedicine(value, name)}
                          dropdownStyle={{ maxHeight: 200, overflow: 'auto' }}
                          placeholder="Select medicine"
                          showSearch
                          optionFilterProp="children"
                          filterOption={(input: string, option?: DefaultOptionType) => {
                            const label = option?.children;
                            if (typeof label === 'string') {
                              return (label as string).toLowerCase().includes(input.toLowerCase());
                            }
                            return false;
                          }
                          }
                        >
                          {medicineList && medicineList.map((medicine) => (
                            <Select.Option key={medicine._id} value={medicine.name}>
                              {medicine.name}
                            </Select.Option>
                          ))}
                        </Select>
                      </Form.Item>

                      <Form.Item
                        style={{ width: 150, minHeight: 50 }}
                        label="Unit"
                        layout='vertical'
                        {...restField}
                        name={[name, 'unit']}
                      >
                        <Input readOnly style={{ width: 150 }} placeholder="Unit" />
                      </Form.Item>
                      <Form.Item
                        style={{ width: 150, minHeight: 50 }}
                        label="Quantity"
                        layout='vertical'
                        {...restField}
                        name={[name, 'quantity']}
                        rules={[{ required: true, message: 'Missing quantity' }]}
                      >
                        <InputNumber style={{ width: 150 }} placeholder="Quantity" min={1} />
                      </Form.Item>
                      <Form.Item
                        label="Usage"
                        layout='vertical'
                        style={{ width: 450, minHeight: 50 }}
                        {...restField}
                        name={[name, 'usage']}
                        rules={[{ required: true, message: 'Missing usage' }]}
                      >
                        <Select
                          dropdownStyle={{ maxHeight: 200, overflow: 'auto' }}
                          placeholder="Select usage"
                          showSearch
                          optionFilterProp="children"
                          filterOption={(input: string, option?: DefaultOptionType) => {
                            const label = option?.children;
                            if (typeof label === 'string') {
                              return (label as string).toLowerCase().includes(input.toLowerCase());
                            }
                            return false;
                          }
                          }>
                          <Select.Option value="sample">Sample</Select.Option>
                        </Select>
                      </Form.Item>
                      {/* <Form.Item >
                        <MinusCircleOutlined onClick={() => remove(name)} />
                      </Form.Item> */}
                      <div>
                        <MinusCircleOutlined
                          style={{ fontSize: 20, color: '#ff4d4f', marginBottom: 18, cursor: 'pointer' }}
                          onClick={() => remove(name)}
                        />
                      </div>
                    </Space>
                  ))}
                  <Form.Item>
                    <Button style={{ width: 100, height: 35 }} color="primary" variant="filled" onClick={() => add()} block icon={<PlusOutlined />}>
                      Add
                    </Button>
                  </Form.Item>
                </>
              )}
            </Form.List>
          </div>
          <Form.Item className='mt-10' >
            <Button type="primary" htmlType="submit">
              Save
            </Button>
            <Button className='ml-4' color="default" variant="outlined" onClick={() => router.back()}>
              Go back
            </Button>
          </Form.Item>
        </Form >
      </div >

      {/* End Prescription form */}

    </>
  )
}
export default CreatePrescription;