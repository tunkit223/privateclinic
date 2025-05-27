"use client"
import { UpdatePrescriptionStatus } from "@/lib/actions/prescription.action";
import { Button } from "antd";
import { useState } from "react";
import { IoCheckmarkDoneSharp } from "react-icons/io5";

type PrescriptionStatusButtonProps = {
  isPaid?: boolean;
  prescriptionId: string;
}


const PrescriptionStatusButton = ({ isPaid, prescriptionId }: PrescriptionStatusButtonProps) => {
  const [statusPaid, setStatusPaid] = useState(isPaid ?? false);
  const handleChangePaid = async () => {
    console.log("Current status paid:", prescriptionId, statusPaid);
    setStatusPaid(!statusPaid);
    console.log("After status paid:", prescriptionId, !statusPaid);
    UpdatePrescriptionStatus(prescriptionId, !statusPaid)
  }
  return (
    <Button style={{ width: 80, fontSize: 17 }} onClick={handleChangePaid} color={statusPaid ? "green" : "orange"} variant="filled" className="text-14-medium">
      {statusPaid ? <div className="flex items-center"><span><IoCheckmarkDoneSharp />
      </span>
        <span className="ml-1">Paid</span>
      </div> : "Unpaid"}
    </Button>
  )
}
export default PrescriptionStatusButton;