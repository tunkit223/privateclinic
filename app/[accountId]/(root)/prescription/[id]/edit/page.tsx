"use client"
import EditPrescriptionDetails from "@/components/table/PrescriptionTable/EditPrescriptionDetails";
import { use } from "react"
function EditPrescriptionPage({ params: paramsPromise }: { params: Promise<{ id: string }> }) {
  const params = use(paramsPromise)
  return (
    <EditPrescriptionDetails prescriptionId={params.id} />
  )
}
export default EditPrescriptionPage;