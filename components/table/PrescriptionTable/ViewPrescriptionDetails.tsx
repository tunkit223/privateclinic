"use client"
import { useEffect, useState } from "react";
import { Button, Skeleton, Tooltip } from "antd";
import { GrView } from "react-icons/gr";
import { Modal } from "antd";
import { Form, Input, Select, Space, InputNumber, Tag } from "antd";
import { getPrescriptionById, getPrescriptionDetailsById } from "@/lib/actions/prescription.action";
import {
  CheckCircleOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons';
import { BsFillSunriseFill } from "react-icons/bs";
import { IoSunnySharp } from "react-icons/io5";
import { BsFillSunsetFill } from "react-icons/bs";
import { IoMoon } from "react-icons/io5";

interface ViewPrescriptionDetailsProps {
  prescriptionId: string;
}

interface DataTitleViewPrescription {
  code: string,
  isPaid: boolean;
}
const ViewPrescriptionDetails = ({ prescriptionId }: ViewPrescriptionDetailsProps) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [form] = Form.useForm();
  const [dataTitlePrescription, setDataTitlePrescription] = useState<DataTitleViewPrescription | null>(null);


  useEffect(() => {
    if (open) {
      const fetchPrescription = async () => {
        const data = await getPrescriptionById(prescriptionId);
        setDataTitlePrescription(data);
        const details = await getPrescriptionDetailsById(prescriptionId);
        console.log(details)


        const formattedDetails = (details || []).map((item: any) => {
          const priceMedicine = item.medicineId?.price || 0;
          const quantity = item.quantity || 0;
          return {
            name: item.medicineId?.name || '',
            unit: item.medicineId?.unit || '',
            duration: item.duration || '',
            morningDosage: item.morningDosage ?? '',
            noonDosage: item.noonDosage ?? '',
            afternoonDosage: item.afternoonDosage || '',
            eveningDosage: item.eveningDosage || '',
            quantity: quantity,
            usage: item.usageMethodId?.name || '',
            priceQuantity: quantity * priceMedicine
          }
        })
        if (data) {
          form.setFieldsValue({
            patientName: data?.medicalReportId?.appointmentId?.patientId?.name,
            doctor: data?.prescribeByDoctor?.name,
            prescriptionDetails: formattedDetails,
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
        width={1450}
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
                  <Input size='large' readOnly></Input>
                </Form.Item>
                <Form.Item
                  label="Doctor"
                  name="doctor"
                  layout='vertical'
                  style={{ width: 500 }}
                >
                  <Input size='large' readOnly></Input>
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
                          name={[name, 'name']}
                        >
                          <Input size='large' readOnly></Input>
                        </Form.Item>

                        <Form.Item
                          style={{ width: 80, minHeight: 50 }}
                          label="Unit"
                          layout='vertical'
                          {...restField}
                          name={[name, 'unit']}
                        >
                          <Input size='large' readOnly style={{ width: 80 }} placeholder="Unit" />
                        </Form.Item>
                        <Form.Item
                          style={{ width: 80, minHeight: 50 }}
                          label="Duration"
                          layout='vertical'
                          {...restField}
                          name={[name, 'duration']}
                        >
                          <Input size='large' readOnly></Input>
                        </Form.Item>
                        <Form.Item
                          label="Dosage schedule"
                          layout='vertical'

                          style={{ width: 350, minHeight: 50 }}
                          required
                        >
                          <Space.Compact block size='large' >
                            <Form.Item name={[name, 'morningDosage']} noStyle>
                              <InputNumber readOnly addonBefore={<BsFillSunriseFill style={{ color: '#FDB44B', fontSize: 20 }} />

                              } min={0} size='large' placeholder="Morning" />
                            </Form.Item>
                            <Form.Item name={[name, 'noonDosage']} noStyle>
                              <InputNumber readOnly addonBefore={<IoSunnySharp style={{ color: '#EB6440', fontSize: 20 }} />
                              } min={0} placeholder="Noon" />
                            </Form.Item>
                            <Form.Item name={[name, 'afternoonDosage']} noStyle>
                              <InputNumber readOnly addonBefore={<BsFillSunsetFill style={{ color: '#A62C2C', fontSize: 20 }} />
                              } min={0} placeholder="Afternoon" />
                            </Form.Item>
                            <Form.Item name={[name, 'eveningDosage']} noStyle>
                              <InputNumber readOnly addonBefore={<IoMoon style={{ color: '#27548A', fontSize: 20 }} />
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
                        >
                          <Input size='large' readOnly></Input>
                        </Form.Item>
                        <Form.Item
                          style={{ width: 70, minHeight: 50 }}
                          label="Quantity"
                          layout='vertical'
                          {...restField}
                          name={[name, 'quantity']}
                        >
                          <Input size='large' readOnly></Input>
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