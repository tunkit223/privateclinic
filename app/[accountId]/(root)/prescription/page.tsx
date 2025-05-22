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


  // Fetch prescription
  useEffect(() => {
    const fetchPrescription = async () => {
      try {
        const response = await getPrescriptionList();
        setPrescription(response);
      } catch (err) {
        console.log("Error fetch prescription:", err);
      }
    }
    fetchPrescription();
  }, [])
  console.log(prescription);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      medicalReportId: "6826e3e701c52a3a6d413b2c",
      details: [
        {
          medicineId: "6651a7dfbcb01234f8abcd01",
          name: "Paracetamol",
          quantity: 2,
          unit: "viên",
          usage: "Uống sau ăn",
          price: 5000,
        },
        {
          medicineId: "6651a7dfbcb01234f8abcd02",
          name: "Amoxicillin",
          quantity: 1,
          unit: "ống",
          usage: "Tiêm mỗi sáng",
          price: 10000,
        },
      ],
    };
    await createPrescription(payload);
  };
  // const table = DataTable(columns, prescription.documents);
  return (
    <>
      {/* <Button onClick={handleAdd} >Create prescription</Button>
      <form onSubmit={handleSubmit}>
        <button type="submit">Submit</button>
      </form>
      <DataTable columns={columns} data={prescription.documents} /> */}
      <div className="header flex justify-between items-center">
        <Input
          placeholder="Search by prescription..."
          className="w-full max-w-[500px] text-dark-200 py-5 border border-dark-200 rounded-lg  focus:ring-blue-500 focus:border-blue-500 transition-all mb-3"
        />
        <Button color="green" onClick={handleAdd} variant="solid" icon={<FaPlus />
        } iconPosition="start">
          Create prescription
        </Button>
      </div>
      {/* <div className="body">
        <div className="table">
        </div>
      </div> */}
      <DataTable columns={columns} data={prescription.documents} />

    </>
  )
}
export default Prescription; 
