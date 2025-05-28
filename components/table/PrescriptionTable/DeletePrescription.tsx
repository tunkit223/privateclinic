import { RiDeleteBin6Line } from "react-icons/ri";
import React, { useState } from 'react';
import { Button, Popconfirm } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { deletePrescription } from "@/lib/actions/prescription.action";


interface DeletePrescriptionDetailsProps {
  prescriptionId: string;
  onDeleted?: () => void;
}

const DeletePrescriptionDetails = ({ prescriptionId, onDeleted }: DeletePrescriptionDetailsProps) => {

  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);

  const showPopconfirm = () => {
    setOpen(true);
  };

  const handleOk = async () => {
    setConfirmLoading(true);
    await deletePrescription(prescriptionId);


    setTimeout(() => {
      setOpen(false);
      setConfirmLoading(false);
      onDeleted?.();
    }, 1000);
  };

  const handleCancel = () => {
    console.log('Clicked cancel button');
    setOpen(false);
  };


  return (
    <Popconfirm
      title="Delete the prescription"
      description="Are you sure to delete this prescription?"
      icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
      onConfirm={handleOk}
      onCancel={handleCancel}
      okButtonProps={{ loading: confirmLoading }}
      open={open}
    >

      <Button onClick={showPopconfirm} icon={<RiDeleteBin6Line />
      } style={{
        width: 30,
        border: "none",
        fontSize: "20px",
        backgroundColor: "transparent",
      }}>
      </Button>
    </Popconfirm>

  )
}
export default DeletePrescriptionDetails;