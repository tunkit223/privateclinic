"use client"
import React, { useCallback, useEffect, useState } from 'react';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { Alert, Button, Form, Input, InputNumber, message, Row, Space } from 'antd';
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
  const [form] = Form.useForm();

  const [medicineList, setMedicineList] = useState<IMedicine[]>([]);
  const [patientExaminedList, setPatientExaminedList] = useState<PatientExamined[]>([]);
  const [doctorList, setDoctorList] = useState<IDoctor[]>([]);
  const [alertDuplicateMedicine, setAlertDuplicateMedicine] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const key = "updatable"


  useEffect(() => {
    Promise.all([getPatientExaminedList(), getMedicineList(), getEmployeesList()])
      .then(([patients, medicines, doctors]) => {
        setPatientExaminedList(patients);
        setMedicineList(medicines.documents);
        setDoctorList(doctors.documents);
      })
      .catch(err => console.error("Error fetching initial data", err))
  }, [])

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
    // console.log("Payload to create prescription:", payload);
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
        })
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
    const isDuplicate = currentDetail.some((item: any, index: number) => index !== fieldName && item?.name === value);
    if (isDuplicate) {
      setAlertDuplicateMedicine(true);
      return;
    }
    if (alertDuplicateMedicine) {
      setAlertDuplicateMedicine(false);
    }

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
  return (
    <>
      {contextHolder}
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
                  {/* {renderSelectOptions(patientExaminedList, 'name', 'name')} */}
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