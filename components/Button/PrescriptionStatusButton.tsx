"use client"
import { UpdatePrescriptionStatus } from "@/lib/actions/prescription.action";
import { Button, Tag } from "antd";
import { useState } from "react";
import { IoCheckmarkDoneSharp } from "react-icons/io5";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  SyncOutlined,
} from '@ant-design/icons';
import { StatusInfo } from "../Types/excel";
type PrescriptionStatusButtonProps = {
  isPaid?: boolean;
  prescriptionId: string;
  onUpdated: () => void;
}


const PrescriptionStatusButton = ({ isPaid, prescriptionId, onUpdated }: PrescriptionStatusButtonProps) => {
  const [statusPaid, setStatusPaid] = useState(isPaid ?? false);


  const statusDataMap: Record<string, StatusInfo> = {
    true: {
      color: 'success',
      icon: <CheckCircleOutlined />
    },
    false: {
      color: 'processing',
      icon: <SyncOutlined spin />
    },
  }
  const statusString = String(statusPaid)
  const statusData = statusDataMap[statusString] || { color: 'default', icon: null }

  return (
    <Tag className="text-lg font-medium w-[120px] flex items-center justify-center"
      color={statusData.color}
      icon={statusData.icon}>
      <span className="ml-1">{statusPaid ? 'Paid' : 'Unpaid'}</span>
    </Tag>
  )
}
export default PrescriptionStatusButton;