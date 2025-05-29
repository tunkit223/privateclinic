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
import { IUsageMethod } from '@/database/usageMethod.model';

import { getPrescriptionById, getPrescriptionDetailsById, getPatientExaminedList, UpdatePrescription, } from "@/lib/actions/prescription.action";
import { useRouter } from "next/navigation";

import {
  CheckCircleOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons';
import { getUsageMethodList } from "@/lib/actions/usageMethod.action";

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
  const [usageMethodList, setUsageMethodList] = useState<IUsageMethod[]>([]);

  const [messageApi, contextHolder] = message.useMessage();
  const key = "updatable"
  const router = useRouter();
  const [form] = Form.useForm();

  // Open modal
  useEffect(() => {
    showModal();
  }, []);

  // Func showModal
  const showModal = async () => {
    setOpen(true);
    setLoading(true);
    try {
      const [patients, medicines, doctors, prescription, details, usageMethods] = await Promise.all([
        getPatientExaminedList(),
        getMedicineList(),
        getEmployeesList(),
        getPrescriptionById(prescriptionId),
        getPrescriptionDetailsById(prescriptionId),
        getUsageMethodList()
      ]);

      setPatientExaminedList(patients);
      setMedicineList(medicines.documents);
      setDoctorList(doctors.documents);
      setDataTitlePrescription(prescription);
      setUsageMethodList(usageMethods)

      const formattedDetails = (details || []).map((item: any) => ({
        medicineId: item.medicineId?._id || '',
        unit: item.medicineId?.unit || '',
        quantity: item.quantity || '',
        usage: item.usageMethodId?._id || '',
      }))
      console.log("Formatted details set to form:", formattedDetails);

      if (prescription) {
        form.setFieldsValue({
          patientName: prescription?.medicalReportId?.appointmentId?.patientId?.name,
          doctor: prescription?.prescribeByDoctor?._id,
          prescriptionDetails: formattedDetails,
        });
      }
    } catch (err) {
      console.error("Error fetching data:", err);
      messageApi.error("Failed to load prescription data");
    } finally {
      setLoading(false);
    }
  };

  // Handle oke modal
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

  // Handle cancel modal
  const handleCancel = () => {
    setOpen(false);
    setAlertDuplicateMedicine(false);
    router.back();
  };

  // Handle change select medicine
  const handleChangeSelectMedicine = (value: string, fieldName: number) => {
    const currentDetail = form.getFieldValue('prescriptionDetails') || [];
    console.log("value", value);
    console.log("field name", fieldName)
    console.log("curr details", currentDetail);

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
    if (medicine) {
      const currentDetail = form.getFieldValue('prescriptionDetails') || [];
      currentDetail[fieldName] = {
        ...currentDetail[fieldName],
        unit: medicine.unit,
      };
      console.log(currentDetail[fieldName])
      form.setFieldsValue({ prescriptionDetails: currentDetail });
    }
  }

  // On finish form
  const onFinish = async (values: any) => {
    const selectedPatient = patientExaminedList.find(pt => pt.name === values.patientName);
    const prescriptionDetails = values.prescriptionDetails.map((item: any) => {
      const medicineSelected = medicineList.find(med => med._id === item.medicineId);
      return {
        medicineId: medicineSelected?._id,
        quantity: item.quantity,
        usageMethodId: item.usage,
        price: medicineSelected?.price || 0
      }
    })
    const payload = {
      medicalReportId: selectedPatient?.medicalReportId || '',
      prescribeByDoctor: values.doctor,
      details: prescriptionDetails,
    }
    console.log("payload", payload);
    try {
      messageApi.open({
        key,
        type: 'loading',
        content: "Updating prescription",
      });
      await UpdatePrescription(prescriptionId, payload);

      // Message success
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
      messageApi.open({
        key,
        type: 'error',
        content: "Failed to update prescription. Please try again",
      });
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
                          name={[name, 'medicineId']}
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
                              <Select.Option key={medicine._id} value={medicine._id}>
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
                            {usageMethodList && usageMethodList.map((use) => (
                              <Select.Option key={use._id.toString()} value={use._id} >
                                {use.name}
                              </Select.Option>
                            ))}                          </Select>
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