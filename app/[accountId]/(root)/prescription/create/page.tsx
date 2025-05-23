"use client"
import React, { useEffect, useState } from 'react';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Form, Input, InputNumber, Row, Space } from 'antd';
import { Select } from 'antd';
import { useRouter } from 'next/navigation';
import { getMedicineList } from '@/lib/actions/medicine.action';
import type { DefaultOptionType } from 'antd/es/select';
import { getPatientExaminedList, getPrescriptionList } from "@/lib/actions/prescription.action";

interface IMedicine {
  _id: string;
  name: string;
  unit: string;
}

interface PatientExamined {
  id: string,
  name: string
}



function CreatePrescription() {
  const router = useRouter();
  const [medicineList, setMedicineList] = useState<IMedicine[]>([]);
  const [patientExaminedList, setPatientExaminedList] = useState<PatientExamined[]>([]);

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
  console.log("MedicineList", medicineList);

  const onFinish = (values: any) => {
    console.log('Received values of form:', values);
  };

  return (
    <>
      <div >
        <Form
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
                <Select placeholder="Select patient">
                  {patientExaminedList && patientExaminedList.map((pt) => (
                    <Select.Option key={pt.id} value={pt.name} >
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
                <Select placeholder="Select doctor">
                  <Select.Option value="sample">Nguyen Van A</Select.Option>
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
                        {/* <Select placeholder="Select unit">
                          <Select.Option value="sample">Sample</Select.Option>
                        </Select> */}
                        <Input disabled style={{ width: 150 }} placeholder="Unit" />
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