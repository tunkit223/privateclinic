import { RiDeleteBin6Line } from "react-icons/ri";
import React, { useState } from 'react';
import { Button, Popconfirm, Tooltip } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { deletePrescription } from "@/lib/actions/prescription.action";


interface DeleteInvoiceProps {
  invoiceId: string;
  onDeleted?: () => void;
}

const DeleteInvoice = ({ invoiceId, onDeleted }: DeleteInvoiceProps) => {

  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);

  const showPopconfirm = () => {
    setOpen(true);
  };

  const handleOk = async () => {
    setConfirmLoading(true);
    try {
      const response = await fetch("/api/invoices/delete", {
        method: 'POST',
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ invoiceId })
      })

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete invoice');
      }
      const result = await response.json();
      console.log(result.message);


    } catch (error) {
      console.error('Error deleting invoice:', error);
    } finally {
      setOpen(false);
      setConfirmLoading(false);
      onDeleted?.();
    }
  };

  const handleCancel = () => {
    console.log('Clicked cancel button');
    setOpen(false);
  };


  return (
    <Tooltip title="Delete">
      <Popconfirm
        title="Delete the invoice"
        description="Are you sure to delete this invoice?"
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
    </Tooltip>

  )
}
export default DeleteInvoice;