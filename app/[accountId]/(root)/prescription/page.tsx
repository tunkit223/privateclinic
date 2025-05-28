"use client"
import { createPrescription, getPrescriptionList } from "@/lib/actions/prescription.action";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "antd";
import { Form } from "react-hook-form";
import { getPatientRecord } from "@/lib/actions/patient.actions";
import DataTable from "@/components/table/PrescriptionTable/PrescriptionTable";
import { columns } from "@/components/table/PrescriptionTable/prescriptionColumns";
import { IPrescription } from "@/database/prescription.model";
import { FaPlus } from "react-icons/fa";
import { Input } from "../../../../components/ui/input"


interface PrescriptionData {
  documents: IPrescription[];
}

function Prescription() {

  const params = useParams();
  const router = useRouter();

  const handleAdd = () => {
    const accountId = params?.accountId;
    router.push(`/${accountId}/prescription/create`);
  }
  const [prescription, setPrescription] = useState<PrescriptionData>({ documents: [] });

  const fetchPrescription = async () => {
    try {
      const response = await getPrescriptionList();
      setPrescription(response);
    } catch (err) {
      console.log("Error fetch prescription:", err);
    }
  }

  // Fetch prescription
  useEffect(() => {
    fetchPrescription();
  }, [])
  // console.log(prescription);

  return (
    <>

      <div className="header flex justify-between items-center">
        <Input
          placeholder="Search by prescription..."
          className="w-full max-w-[500px] text-dark-200 py-5 border border-dark-200 rounded-lg  focus:ring-blue-500 focus:border-blue-500 transition-all mb-3"
        />
        <Button style={{
          backgroundColor: "#4EC092",
          color: "#fff",
          fontSize: "15px",
          fontWeight: "600",
        }} onClick={handleAdd} variant="solid" icon={<FaPlus />
        } iconPosition="start">
          Create prescription
        </Button>
      </div>
      {/* <DataTable columns={columns({ onDeleted: fetchPrescription })}
        data={prescription.documents.reverse()} /> */}
      <DataTable columns={columns({ onDeleted: fetchPrescription })} data={prescription.documents.reverse()} />

    </>
  )
}
export default Prescription; 
