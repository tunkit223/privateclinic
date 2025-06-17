"use client"

import { useEffect, useState } from "react";
import { Button, message, Skeleton } from "antd";
import { GrView } from "react-icons/gr";
import { Modal } from "antd";
import { Form, Input, Select, Space, InputNumber, Tag, Alert, } from "antd";
import { getEmployeesList, getName } from '@/lib/actions/employees.action';
import { checkMedicineStock, getMedicineById, getMedicineList } from '@/lib/actions/medicine.action';
import type { DefaultOptionType } from 'antd/es/select';
import { IMedicine } from "@/lib/interfaces/medicine.interface";
import { PatientExamined } from "@/lib/interfaces/patientExamined.interface";
import { IDoctor } from "@/lib/interfaces/doctor.interface";
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { IUsageMethod } from '@/database/usageMethod.model';

import { getPrescriptionById, getPrescriptionDetailsById, getPatientExaminedList, UpdatePrescription, } from "@/lib/actions/prescription.action";
import { useRouter } from "next/navigation";
import { BsFillSunriseFill } from "react-icons/bs";
import { IoSunnySharp } from "react-icons/io5";
import { BsFillSunsetFill } from "react-icons/bs";
import { IoMoon } from "react-icons/io5";
import {
  CheckCircleOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons';
import { getUsageMethodList } from "@/lib/actions/usageMethod.action";
import dayjs from "dayjs";

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
      const [medicines, doctors, prescription, details, usageMethods] = await Promise.all([
        // getPatientExaminedList(prescriptionId.medicalReportId),
        getMedicineList(),
        getEmployeesList(),
        getPrescriptionById(prescriptionId),
        getPrescriptionDetailsById(prescriptionId),
        getUsageMethodList()
      ]);
      const patients = await getPatientExaminedList(prescription.medicalReportId);


      setPatientExaminedList(patients);
      setMedicineList(medicines.documents);
      setDoctorList(doctors.documents);
      setDataTitlePrescription(prescription);
      setUsageMethodList(usageMethods)

      const formattedDetails = (details || []).map((item: any) => {
        const priceMedicine = item.medicineId?.price || 0;
        const quantity = item.quantity || 0;

        return {
          medicineId: item.medicineId?._id || '',
          unit: item.medicineId?.unit || '',
          duration: item.duration ?? '',
          morningDosage: item.morningDosage ?? '',
          noonDosage: item.noonDosage ?? '',
          afternoonDosage: item.afternoonDosage ?? '',
          eveningDosage: item.eveningDosage ?? '',
          quantity: item.quantity || '',
          usage: item.usageMethodId?._id || '',
          priceQuantity: quantity * priceMedicine || ''

        }
      })
      // console.log("Formatted details set to form:", formattedDetails);

      if (prescription) {
        // console.log("pres", prescription)
        const selectedDoctor = doctorList.find(
          (dt: IDoctor) => dt._id === prescription.prescribeByDoctor?._id
        )


        form.setFieldsValue({
          patientId: prescription?.medicalReportId?.appointmentId?.patientId?._id,
          doctor: {
            value: prescription?.prescribeByDoctor?._id,
            label: selectedDoctor ? selectedDoctor.name : prescription.prescribeByDoctor?.name || "Unknown doctor"
          },
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
      // console.log(currentDetail[fieldName])
      form.setFieldsValue({ prescriptionDetails: currentDetail });
    }
  }

  const handleChangeValues = (changeValues: any, allValues: any) => {
    if (!changeValues.prescriptionDetails) return;
    const updatedDetails = allValues.prescriptionDetails.map((dt: any, index: any) => {
      if (!dt) return;
      const quantity = dt.quantity || 0;
      const medicine = medicineList.find(m => m._id === dt.medicineId);
      const price = medicine?.price || 0;

      // Check duplicate when remove row prescriptionDetail
      const medicineIds = allValues.prescriptionDetails
        .map((item: any) => item?.medicineId)
        .filter(Boolean);
      const uniqueIds = new Set(medicineIds);
      setAlertDuplicateMedicine(uniqueIds.size !== medicineIds.length);

      return {
        ...dt,
        priceQuantity: quantity * price
      }
    });

    form.setFieldsValue({ prescriptionDetails: updatedDetails })
  }

  // On finish form
  const onFinish = async (values: any) => {
    const selectedPatient = patientExaminedList.find(pt => pt.patientId === values.patientId);

    const prescriptionDetails = await Promise.all(
      values.prescriptionDetails.map(async (item: any) => {
        const medicineSelected = medicineList.find(med => med._id === item.medicineId);

        const stock = await checkMedicineStock(item.medicineId);
        if (!stock.success) {
          messageApi.open({
            key,
            type: 'error',
            content: stock.message || `Cannot check medicine stock ${medicineSelected?.name || item.medicineId}`,
            duration: 3,
          });
          return null;
        }

        if ((stock.data?.availableQuantity || 0) < item.quantity) {
          messageApi.open({
            key,
            type: 'error',
            content: `Medicine ${name} not enough in inventory. Request: ${item.quantity}, Stock: ${stock.data?.availableQuantity}`,
            duration: 3,
          });
          return null;
        }

        return {
          medicineId: medicineSelected?._id,
          quantity: item.quantity,
          duration: item.duration,
          morningDosage: item.morningDosage,
          afternoonDosage: item.afternoonDosage,
          noonDosage: item.noonDosage,
          eveningDosage: item.eveningDosage,
          usageMethodId: item.usage,
          price: medicineSelected?.price || 0,
        };

      })
    );
    const payload = {
      medicalReportId: selectedPatient?.medicalReportId || '',
      prescribeByDoctor: values.doctor,
      details: prescriptionDetails,
    }

    // Check if null -> cancel create prescription
    const filterNotNull = prescriptionDetails.filter(detail => detail !== null);
    if (filterNotNull.length !== values.prescriptionDetails.length) {
      return;
    }

    // console.log("payload", payload);
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
        width={1520}
        title={
          dataTitlePrescription ? (
            <>
              <div className="text-xl mb-2">Edit prescription - <Tag style={{ fontSize: 18, paddingBottom: 1 }} color={dataTitlePrescription?.isPaid ? "green" : "blue"}>{dataTitlePrescription?.code}</Tag></div>
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
                }} icon={<ExclamationCircleOutlined />} color="blue">
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
            onValuesChange={handleChangeValues}
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
                  name="patientId"
                  layout='vertical'
                  style={{ width: 500, minHeight: 40 }}
                  rules={[{ required: true, message: 'Missing patient' }]}
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
                      const label = `${pt.name} - ${dayjs(pt.dateAppointment).format("DD/MM/YYYY - hh:mm A")}`;
                      // console.log("pt", pt)
                      return (
                        <Select.Option
                          style={{ fontSize: "17px" }}
                          key={pt.medicalReportId}
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
                    size="large"
                    placeholder="Select doctor"
                    dropdownStyle={{ maxHeight: 200, overflow: 'auto', }}
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
                    {doctorList && doctorList.filter((dt: IDoctor) => !dt.deleted).map(dt => (
                      <Select.Option style={{ fontSize: "17px" }} key={dt._id} value={dt._id}>
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
                      <Space key={key} style={{ display: 'flex', marginBottom: 20, gap: 20, alignItems: "flex-end", }} >
                        <Form.Item
                          label="Medicine name"
                          layout='vertical'
                          style={{ width: 200, minHeight: 50 }}
                          {...restField}
                          name={[name, 'medicineId']}
                          rules={[{ required: true, message: 'Missing medicine name' }]}
                        >
                          <Select
                            size="large"
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
                          style={{ width: 80, minHeight: 50 }}
                          label="Unit"
                          layout='vertical'
                          {...restField}
                          name={[name, 'unit']}
                          rules={[{ required: true, message: 'Missing unit' }]}

                        >
                          <Input size="large" readOnly style={{ width: 80 }} placeholder="Unit" />
                        </Form.Item>
                        <Form.Item
                          style={{ width: 110, minHeight: 50 }}
                          label="Duration"
                          layout='vertical'
                          {...restField}
                          name={[name, 'duration']}
                          rules={[{ required: true, message: 'Missing duration' }]}
                        >
                          <InputNumber min={1} addonAfter={"Day"} size='large' ></InputNumber>
                        </Form.Item>
                        <Form.Item
                          label="Dosage schedule"
                          layout='vertical'

                          style={{ width: 350, minHeight: 50 }}
                          required
                        >
                          <Space.Compact block size='large' >
                            <Form.Item name={[name, 'morningDosage']} noStyle
                              rules={[{ required: true, message: 'Missing morning dosage' }]}
                            >
                              <InputNumber addonBefore={<BsFillSunriseFill style={{ color: '#FDB44B', fontSize: 20 }} />

                              } min={0} size='large' placeholder="Morning" />
                            </Form.Item>
                            <Form.Item name={[name, 'noonDosage']} noStyle
                              rules={[{ required: true, message: 'Missing noon dosage' }]}
                            >
                              <InputNumber addonBefore={<IoSunnySharp style={{ color: '#EB6440', fontSize: 20 }} />
                              } min={0} placeholder="Noon" />
                            </Form.Item>
                            <Form.Item name={[name, 'afternoonDosage']} noStyle
                              rules={[{ required: true, message: 'Missing afternoon dosage' }]}
                            >
                              <InputNumber addonBefore={<BsFillSunsetFill style={{ color: '#A62C2C', fontSize: 20 }} />
                              } min={0} placeholder="Afternoon" />
                            </Form.Item>
                            <Form.Item name={[name, 'eveningDosage']} noStyle
                              rules={[{ required: true, message: 'Missing evening dosage' }]}
                            >
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
                            size="large"
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
                          style={{ width: 70, minHeight: 50 }}
                          label="Quantity"
                          layout='vertical'
                          {...restField}
                          name={[name, 'quantity']}
                        >
                          <InputNumber size="large" style={{ width: 70 }} placeholder="Quantity" min={1} />
                        </Form.Item>
                        <Form.Item
                          style={{ width: 160, minHeight: 50 }}
                          label="Price"
                          layout='vertical'
                          {...restField}
                          name={[name, 'priceQuantity']}
                        >
                          <Input size='large' addonAfter={"$"} readOnly></Input>
                        </Form.Item>
                        <div>
                          <MinusCircleOutlined
                            style={{ fontSize: 20, color: '#ff4d4f', marginBottom: 15, cursor: 'pointer' }}
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
      </Modal >
    </>
  )
}
export default EditPrescriptionDetails;