"use client"
import { useEffect, useState } from "react";
import { Button, Skeleton, Tooltip } from "antd";
import { GrView } from "react-icons/gr";
import { Modal } from "antd";
import { Form, Input, Select, Space, InputNumber, Tag, message } from "antd";
import { getPrescriptionById, getPrescriptionDetailsById, getPatientExaminedList, UpdatePrescription, } from "@/lib/actions/prescription.action";
import {
  CheckCircleOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons';
import { getUsageMethodList } from "@/lib/actions/usageMethod.action";


import { IMedicine } from "@/lib/interfaces/medicine.interface";
import { PatientExamined } from "@/lib/interfaces/patientExamined.interface";
import { IDoctor } from "@/lib/interfaces/doctor.interface";
import { IUsageMethod } from "@/lib/interfaces/usageMethod.interface";
import { useRouter } from "next/navigation";
import { getEmployeesList } from '@/lib/actions/employees.action';
import { getMedicineList } from '@/lib/actions/medicine.action';

interface ViewPrescriptionDetailsProps {
  prescriptionId: string;
}

interface DataTitleViewPrescription {
  code: string,
  isPaid: boolean;
}
const ViewPrescriptionDetails = ({ prescriptionId }: ViewPrescriptionDetailsProps) => {
  // const [open, setOpen] = useState(false);
  // const [loading, setLoading] = useState<boolean>(false);
  // const [form] = Form.useForm();
  // const [dataTitlePrescription, setDataTitlePrescription] = useState<DataTitleViewPrescription | null>(null);


  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [dataTitlePrescription, setDataTitlePrescription] = useState<DataTitleViewPrescription | null>(null);
  const [medicineList, setMedicineList] = useState<IMedicine[]>([]);
  const [patientExaminedList, setPatientExaminedList] = useState<PatientExamined[]>([]);
  const [doctorList, setDoctorList] = useState<IDoctor[]>([]);
  const [alertDuplicateMedicine, setAlertDuplicateMedicine] = useState(false);
  const [usageMethodList, setUsageMethodList] = useState<IUsageMethod[]>([]);

  const [messageApi, contextHolder] = message.useMessage();
  const key = "updatable"
  const router = useRouter();
  const [form] = Form.useForm();



  // const showModal = async () => {
  //   setOpen(true);
  //   setLoading(true);
  //   try {
  //     const [prescription, details, usageMethods] = await Promise.all([
  //       getPrescriptionById(prescriptionId),
  //       getPrescriptionDetailsById(prescriptionId),
  //       getUsageMethodList()
  //     ]);
  //     setDataTitlePrescription(prescription);
  //     const formattedDetails = (details || []).map((item: any) => ({
  //       name: item.medicineId?.name || "",
  //       unit: item.medicineId?.unit || "",
  //       quantity: item.quantity || "",
  //       usage: item.usageMethodId?.name || ""
  //     }))
  //     console.log("dtail", formattedDetails)
  //     if (prescription) {
  //       form.setFieldsValue({
  //         patientName: prescription?.medicalReportId?.appointmentId?.patientId?.name,
  //         doctor: prescription?.prescribeByDoctor?.name,
  //         prescriptionDetails: formattedDetails,
  //       });
  //     }
  //     console.log(prescription)
  //   } catch (error) {
  //     console.error("Error fetching prescription details VIEW:", error);
  //   } finally {
  //     setLoading(false)
  //   }
  // };

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
      console.log("dt", details)

      const formattedDetails = (details || []).map((item: any) => ({
        medicineId: item.medicineId?.name || '',
        unit: item.medicineId?.unit || '',
        quantity: item.quantity || '',
        usage: item.usageMethodId?.name || '',
      }))
      console.log("Formatted details set to form:", formattedDetails);

      if (prescription) {
        form.setFieldsValue({
          patientName: prescription?.medicalReportId?.appointmentId?.patientId?.name,
          doctor: prescription?.prescribeByDoctor?.name,
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

  const handleOk = () => {
    setOpen(false);

  };

  const handleCancel = () => {
    setOpen(false);
  };

  return (
    <>
      <Tooltip title="View detail">
        <Button onClick={showModal} icon={<GrView />
        } style={{
          width: 30,
          border: "none",
          fontSize: "20px",
          backgroundColor: "transparent",
        }}>
        </Button>
      </Tooltip>
      <Modal
        width={1300}
        title={
          dataTitlePrescription ? (
            <>
              <div className="text-xl mb-2">Prescription detail - <Tag style={{ fontSize: 18, paddingBottom: 1 }} color={dataTitlePrescription?.isPaid ? "success" : "warning"}>{dataTitlePrescription?.code}</Tag></div>
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
        onOk={handleOk}
        onCancel={handleCancel}
      >
        {loading ? <Skeleton active /> : (
          <Form
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
                >
                  <Input readOnly>
                  </Input>
                </Form.Item>
                <Form.Item
                  label="Doctor"
                  name="doctor"
                  layout='vertical'
                  style={{ width: 500 }}
                >
                  <Input readOnly></Input>
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
                          name={[name, 'medicineId']}
                        >
                          <Input readOnly></Input>
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
                        >
                          <Input readOnly></Input>
                        </Form.Item>
                        <Form.Item
                          label="Usage"
                          layout='vertical'
                          style={{ width: 450, minHeight: 50 }}
                          {...restField}
                          name={[name, 'usage']}
                        >
                          <Input readOnly></Input>
                        </Form.Item>
                      </Space>
                    ))}
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
export default ViewPrescriptionDetails;