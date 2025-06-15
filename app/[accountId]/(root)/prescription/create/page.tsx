"use client"
import React, { useCallback, useEffect, useState } from 'react';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { Alert, Button, Form, Input, InputNumber, message, Row, Space, Tag, Typography } from 'antd';
import { Select, Tooltip } from 'antd';
import { useRouter } from 'next/navigation';
import { getMedicineList } from '@/lib/actions/medicine.action';
import type { DefaultOptionType } from 'antd/es/select';
import { getPatientExaminedList, createPrescription } from "@/lib/actions/prescription.action";
import { getEmployeesList } from '@/lib/actions/employees.action';
import { IMedicine } from '@/lib/interfaces/medicine.interface';
import { IDoctor } from '@/lib/interfaces/doctor.interface';
import { PatientExamined } from '@/lib/interfaces/patientExamined.interface';
import { Create_EditPrescriptionPayload } from '@/lib/interfaces/create_editPrescriptionPayload.interface';
import { getLayoutOrPageModule } from 'next/dist/server/lib/app-dir-module';
import { getUsageMethodList } from '@/lib/actions/usageMethod.action';
import { IUsageMethod } from '@/database/usageMethod.model';
import { BsFillSunriseFill } from "react-icons/bs";
import { IoSunnySharp } from "react-icons/io5";
import { BsFillSunsetFill } from "react-icons/bs";
import { IoMoon } from "react-icons/io5";
import { ImCalculator } from "react-icons/im";

import dayjs from "dayjs";


function CreatePrescription() {
  const router = useRouter();
  const [form] = Form.useForm();

  const [medicineList, setMedicineList] = useState<IMedicine[]>([]);
  const [patientExaminedList, setPatientExaminedList] = useState<PatientExamined[]>([]);
  const [doctorList, setDoctorList] = useState<IDoctor[]>([]);
  const [alertDuplicateMedicine, setAlertDuplicateMedicine] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const key = "updatable"

  const [usageMethodList, setUsageMethodList] = useState<IUsageMethod[]>([]);


  useEffect(() => {
    Promise.all([getPatientExaminedList(), getMedicineList(), getEmployeesList(), getUsageMethodList()])
      .then(([patients, medicines, doctors, usageMethods]) => {
        setPatientExaminedList(patients);
        setMedicineList(medicines.documents);
        setDoctorList(doctors.documents);
        setUsageMethodList(usageMethods);
      })
      .catch(err => console.error("Error fetching initial data", err))
  }, [])

  console.log(patientExaminedList);
  const onFinish = async (values: any) => {
    // console.log("values", values)
    const selectedPatient = patientExaminedList.find(pt => pt.patientId === values.patientId);
    const prescriptionDetails = values.prescriptionDetails.map((item: any) => {
      const medicineSelected = medicineList.find(med => med._id === item.medicineId);
      return {
        medicineId: medicineSelected?._id,
        quantity: item.quantity,
        duration: item.duration,
        morningDosage: item.morningDosage,
        afternoonDosage: item.afternoonDosage,
        noonDosage: item.noonDosage,
        eveningDosage: item.eveningDosage,
        usageMethodId: item.usage,
        price: medicineSelected?.price || 0
      }
    })
    const payload: Create_EditPrescriptionPayload = {
      medicalReportId: selectedPatient?.medicalReportId || '',
      prescribeByDoctor: values.doctor,
      details: prescriptionDetails,
    }
    console.log("Payload to create prescription:", payload);
    try {
      messageApi.open({
        key,
        type: 'loading',
        content: "Creating prescription",
      });
      const result = await createPrescription(payload);
      // Message success
      setTimeout(() => {
        messageApi.open({
          key,
          type: "success",
          content: "Create prescription successfully",
          duration: 2
        });
        setTimeout(() => {
          router.back();
        }, 1000);
      }, 1000);


    } catch (error) {
      console.log("Error create prescription:", error);
      messageApi.open({
        key,
        type: 'error',
        content: "Failed to create prescription. Please try again",
      });
    }
  };

  const handleChangeSelectMedicine = (value: string, fieldName: number) => {
    const currentDetail = form.getFieldValue('prescriptionDetails') || [];

    // Check medicine is exist in another row ?
    const isDuplicate = currentDetail.some((item: any, index: number) => index !== fieldName && item?.medicineId === value);
    if (isDuplicate) {
      setAlertDuplicateMedicine(true);
      return;
    }
    if (alertDuplicateMedicine) {
      setAlertDuplicateMedicine(false);
    }

    const medicine = medicineList.find((medicine) => medicine._id === value);
    // console.log(medicine);
    if (medicine) {
      const currentDetail = form.getFieldValue('prescriptionDetails') || [];
      currentDetail[fieldName] = {
        ...currentDetail[fieldName],
        unit: medicine.unit,
      };
      form.setFieldsValue({ prescriptionDetails: currentDetail });
    }
  }

  const handleSave = () => {
    if (alertDuplicateMedicine) {
      messageApi.open({
        type: "error",
        content: "Please fix duplicate medicine selection before saving"
      });
      return;
    }
    form.submit();
  }
  const handleChangeValue = (changeValues: any, allValues: any) => {
    if (!changeValues.prescriptionDetails) return;
    const updatedDetails = allValues.prescriptionDetails.map((dt: any, index: any) => {
      // Check duplicate when remove row prescriptionDetail
      const medicineIds = allValues.prescriptionDetails
        .map((item: any) => item?.medicineId)
        .filter(Boolean);
      const uniqueIds = new Set(medicineIds);
      setAlertDuplicateMedicine(uniqueIds.size !== medicineIds.length);
      return {
        ...dt,
      }
    });
    form.setFieldsValue({ prescriptionDetails: updatedDetails })
  }
  return (
    <>
      {contextHolder}
      <div >
        <Form
          onValuesChange={handleChangeValue}
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
                name="patientId"
                layout='vertical'
                style={{ width: 500, minHeight: 40 }}
                rules={[{ required: true, message: 'Missing patient name' }]}
              >
                <Select
                  size="large"
                  dropdownStyle={{ maxHeight: 200, overflow: 'auto', }}
                  placeholder="Select patient name"
                  showSearch
                  optionFilterProp="label"
                  filterOption={(input: string, option?: DefaultOptionType) => {
                    const label = option?.label;
                    if (typeof label === 'string') {
                      return (label as string).toLowerCase().includes(input.toLowerCase());
                    }
                    return false;
                  }
                  }>
                  {patientExaminedList && patientExaminedList.map((pt) => {
                    const label = `${pt.name} - ${dayjs(pt.dateAppointment).format("DD/MM/YYYY")}`;
                    return (
                      <Select.Option style={{ fontSize: "17px" }}
                        key={pt.patientId}
                        value={pt.patientId}
                        label={pt.name}>
                        {label}
                      </Select.Option>

                    )
                  })}
                </Select>
              </Form.Item>
              <Form.Item
                label="Doctor"
                name="doctor"
                layout='vertical'
                style={{ width: 500 }}
                rules={[{ required: true, message: 'Missing doctor' }]}
              >
                <Select
                  size='large' placeholder="Select doctor"
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
                    <Select.Option style={{ fontSize: "17px" }} key={dt._id} value={dt._id}>
                      {dt.name}
                    </Select.Option>
                  ))}
                  {/* {renderSelectOptions(doctorList, 'name', '_id')} */}
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
                        style={{ width: 200, minHeight: 50 }}
                        {...restField}
                        name={[name, 'medicineId']}
                        rules={[{ required: true, message: 'Missing medicine name' }]}
                      >
                        <Select
                          size='large'
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
                            <Select.Option style={{ fontSize: "17px" }} key={medicine._id} value={medicine._id}>
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
                        <Input size='large' readOnly style={{ width: 150 }} placeholder="Unit" />
                      </Form.Item>
                      <Form.Item
                        style={{ width: 150, minHeight: 50 }}
                        label="Duration (days)"
                        layout='vertical'
                        {...restField}
                        name={[name, 'duration']}
                        rules={[{ required: true, message: 'Missing duration' }]}
                      >
                        <InputNumber size='large' style={{ width: 150 }} placeholder="Duration" min={1} />
                      </Form.Item>


                      <Form.Item
                        label="Dosage schedule"
                        layout='vertical'

                        style={{ width: 350, minHeight: 50 }}
                        required
                      >
                        <Space.Compact block size='large'>
                          <Form.Item name={[name, 'morningDosage']} noStyle
                            rules={[{ required: true, message: "Please input morning dosage" }]}>
                            <InputNumber addonBefore={<BsFillSunriseFill style={{ color: '#FDB44B', fontSize: 20 }} />

                            } min={0} size='large' placeholder="Morning" />
                          </Form.Item>
                          <Form.Item name={[name, 'noonDosage']} noStyle
                            rules={[{ required: true, message: "Please input noon dosage" }]}>
                            <InputNumber addonBefore={<IoSunnySharp style={{ color: '#EB6440', fontSize: 20 }} />
                            } min={0} placeholder="Noon" />
                          </Form.Item>
                          <Form.Item name={[name, 'afternoonDosage']} noStyle
                            rules={[{ required: true, message: "Please input afternoon dosage" }]}>
                            <InputNumber addonBefore={<BsFillSunsetFill style={{ color: '#A62C2C', fontSize: 20 }} />
                            } min={0} placeholder="Afternoon" />
                          </Form.Item>
                          <Form.Item name={[name, 'eveningDosage']} noStyle
                            rules={[{ required: true, message: "Please input evening dosage" }]}>
                            <InputNumber addonBefore={<IoMoon style={{ color: '#27548A', fontSize: 20 }} />
                            } min={0} placeholder="Evening" />
                          </Form.Item>
                        </Space.Compact>
                      </Form.Item>

                      <Form.Item
                        label="Usage"
                        layout='vertical'
                        style={{ width: 300, minHeight: 50 }}
                        {...restField}
                        name={[name, 'usage']}
                        rules={[{ required: true, message: 'Missing usage' }]}
                      >
                        <Select
                          size='large'
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
                          {usageMethodList && usageMethodList.map((use) => (
                            <Select.Option style={{ fontSize: "17px" }} key={use._id.toString()} value={use._id} >
                              {use.name}
                            </Select.Option>
                          ))}
                        </Select>
                      </Form.Item>

                      <Form.Item
                        style={{ width: 100, minHeight: 50 }}
                        label="Quantity"
                        layout='vertical'
                        {...restField}
                        name={[name, 'quantity']}
                        rules={[{ required: true, message: 'Missing quantity' }]}
                      >
                        <InputNumber
                          size='large' style={{ width: 100 }} placeholder="Quantity" min={1} />
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
                  {alertDuplicateMedicine && (
                    <Alert onClose={() => setAlertDuplicateMedicine(false)} style={{ marginBottom: 20, fontSize: 16 }} message="This medicine has already been selected in another row. Please choice another!" type="warning" showIcon />
                  )}

                  <Form.Item>
                    <Button style={{ width: 100, height: 35, }} color="primary" variant="filled" onClick={() => add()} block icon={<PlusOutlined />}>
                      Add
                    </Button>
                  </Form.Item>
                </>
              )}
            </Form.List>

          </div>
          <Form.Item className='mt-10' >
            <Button type="primary" onClick={handleSave}>
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