"use client"

import { useEffect, useState } from "react";
import { Button, message, Skeleton } from "antd";
import { GrView } from "react-icons/gr";
import { Modal } from "antd";
import { Form, Input, Select, Space, InputNumber, Tag, Alert, } from "antd";
import { getEmployeesList } from '@/lib/actions/employees.action';
import { getMedicineList } from '@/lib/actions/medicine.action';
import type { DefaultOptionType } from 'antd/es/select';
import { IMedicine } from "@/lib/interfaces/medicine.interface";
import { PatientExamined } from "@/lib/interfaces/patientExamined.interface";
import { IDoctor } from "@/lib/interfaces/doctor.interface";
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { getPrescriptionById, getPrescriptionDetailsById, getPatientExaminedList, UpdatePrescription, } from "@/lib/actions/prescription.action";
import { useRouter } from "next/navigation";

import {
  CheckCircleOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons';

interface EditPrescriptionDetailsProps {
  prescriptionId: string;
}

interface DataTitleEditPrescription {
  code: string,
  isPaid: boolean;
}

const EditPrescriptionDetails = ({ prescriptionId }: EditPrescriptionDetailsProps) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [dataTitlePrescription, setDataTitlePrescription] = useState<DataTitleEditPrescription | null>(null);
  const [medicineList, setMedicineList] = useState<IMedicine[]>([]);
  const [patientExaminedList, setPatientExaminedList] = useState<PatientExamined[]>([]);
  const [doctorList, setDoctorList] = useState<IDoctor[]>([]);
  const [alertDuplicateMedicine, setAlertDuplicateMedicine] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const key = "updatable"

  const router = useRouter();

  const [form] = Form.useForm();
  useEffect(() => {
    showModal();
  }, []);

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
  // console.log("Patient", patientExaminedList);


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

  useEffect(() => {
    if (open) {
      const fetchPrescription = async () => {
        const data = await getPrescriptionById(prescriptionId);
        setDataTitlePrescription(data);
        const details = await getPrescriptionDetailsById(prescriptionId);

        if (data) {
          form.setFieldsValue({
            patientName: data?.medicalReportId?.appointmentId?.patientId?.name,
            doctor: data?.prescribeByDoctor?._id,
            prescriptionDetails: details || [],
          })
        }
      }
      fetchPrescription();
    }
  }, [open, prescriptionId])


  const showModal = async () => {
    setOpen(true);
    setLoading(true);
    setTimeout(() => {
      setLoading(false)
    }, 1500);
  };


  const handleOk = () => {
    if (alertDuplicateMedicine) {
      messageApi.open({
        type: "error",
        content: "Please fix duplicate medicine selection before saving"
      });
      return;
    }
    form.submit();
  };

  const handleCancel = () => {
    setOpen(false);
    setAlertDuplicateMedicine(false);
    router.back();
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

  const onFinish = async (values: any) => {
    const selectedPatient = patientExaminedList.find(pt => pt.name === values.patientName);
    const prescriptionDetailsPrice = values.prescriptionDetails.map((item: any) => {
      const medicineSelected = medicineList.find(med => med.name === item.name);

      // console.log("Medicine Selected:", medicineSelected)
      return {
        medicineId: medicineSelected?._id,
        quantity: item.quantity,
        name: medicineSelected?.name,
        usage: item.usage,
        unit: medicineSelected?.unit || "No data",
        price: medicineSelected?.price || 0
      }
    })
    // console.log("detail:", prescriptionDetailsPrice);
    const payload = {
      medicalReportId: selectedPatient?.medicalReportId || '',
      prescribeByDoctor: values.doctor,
      details: prescriptionDetailsPrice,
    }
    // console.log("Payload to update prescription:", payload);
    try {
      messageApi.open({
        key,
        type: 'loading',
        content: "Updating prescription",
      });
      await UpdatePrescription(prescriptionId, payload);

      setTimeout(() => {
        messageApi.open({
          key,
          type: "success",
          content: "Update prescription successfully",
          duration: 2
        })
      }, 1000);

      // Close modal
      setTimeout(() => {
        setOpen(false)
        router.back();
      }, 1500);

    } catch (error) {
      console.log("Error update prescription:", error);
    }
  };
  return (
    <>
      {contextHolder}

      <Modal
        width={1300}
        title={
          dataTitlePrescription ? (
            <>
              <div className="text-xl mb-2">Edit prescription - {dataTitlePrescription?.code}</div>
              <div>
                {dataTitlePrescription?.isPaid ? <Tag style={{
                  width: 100,
                  fontSize: 17,
                  paddingTop: 5,
                  paddingBottom: 5,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }} icon={<CheckCircleOutlined />} color="success">
                  Paid
                </Tag> : <Tag style={{
                  width: 100,
                  fontSize: 17,
                  paddingTop: 5,
                  paddingBottom: 5
                }} icon={<ExclamationCircleOutlined />} color="warning">
                  Unpaid
                </Tag>}
              </div></>
          ) : <Skeleton active paragraph={{ rows: 0 }} title={false} />
        }
        open={open}
        okText="Save"
        onOk={handleOk}
        onCancel={handleCancel}
      >
        {loading ? <Skeleton active /> : (
          <Form
            onFinish={onFinish}
            form={form}
            initialValues={{ prescriptionDetails: [{}] }}
            name={`dynamic_form_nest_item_${prescriptionId}`}
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
                  rules={[{ required: true, message: 'Missing patient' }]}
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
                      <Space key={key} style={{ display: 'flex', marginBottom: 20, gap: 20, alignItems: "flex-end", justifyContent: "space-between" }} >
                        <Form.Item
                          label="Medicine name"
                          layout='vertical'
                          style={{ width: 300, minHeight: 50 }}
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
                          rules={[{ required: true, message: 'Missing unit' }]}

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
                      <Button style={{ width: 100, height: 35 }} color="primary" variant="filled" onClick={() => add()} block icon={<PlusOutlined />}>
                        Add
                      </Button>
                    </Form.Item>
                  </>
                )}
              </Form.List>
            </div>
          </Form >
        )}
      </Modal>
    </>
  )
}
export default EditPrescriptionDetails;