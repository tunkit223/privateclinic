"use client"

import { useEffect, useState } from "react"
// import { Button } from "@/components/ui/button"
import { Button } from "antd"
import { Card, CardContent } from "@/components/ui/card"
import { Printer, Download } from "lucide-react"
import { format } from "date-fns"
import { getInvoiceById } from "@/lib/actions/invoice.action"
import { useParams, useRouter } from "next/navigation"
import dayjs from "dayjs"
import { IInvoice } from "@/database/invoice.model"




function ViewInvoicePage() {

  const [invoiceFetch, setInvoiceFetch] = useState<IInvoice | null>(null);
  const params = useParams();
  const router = useRouter();
  // console.log(params)
  const invoiceId = params?.id as string;
  const fetchInvoice = async () => {

    try {
      const response = await fetch(`/api/invoices/${invoiceId}`);
      if (!response) {
        throw new Error("Failed to fetch invoice");
      }
      const data: IInvoice = await response.json();
      setInvoiceFetch(data);

    } catch (error) {
      console.log("Failed to fetch invoice", error)
    }
  }
  useEffect(() => {
    fetchInvoice();
  }, [])
  console.log(invoiceFetch);

  const handleBack = () => {
    router.back();
  }
  const [invoiceData] = useState({
    clinic: {
      name: "HealthCare Medical Clinic",
      address: "123 Healing Way, Medical District",
      city: "San Francisco, CA 94103",
      phone: "(555) 123-4567",
      email: "billing@healthcaremedical.com",
      website: "www.healthcaremedical.com",
    },

  })

  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 print:bg-white print:py- print-container">
      <div className="mx-auto max-w-9xl bg-white p-8 shadow-md print:shadow-none">
        <div className="flex justify-between items-start mb-8">
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-800">{invoiceData.clinic.name}</h1>
            <div className="text-lg text-gray-600 mt-1">
              <p>{invoiceData.clinic.address}</p>
              <p>{invoiceData.clinic.city}</p>
              <p>{invoiceData.clinic.phone}</p>
              <p>{invoiceData.clinic.email}</p>
              <p>{invoiceData.clinic.website}</p>
            </div>
          </div>
          <div className="text-right">
            <h2 className="text-3xl font-bold  text-[#60A5FA]">INVOICE</h2>
            <p className="text-gray-600 mt-1 text-lg">#{invoiceFetch?.code}</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6 mb-10">
          <div className="col-span-2 space-y-4">
            <Card>
              <CardContent className="p-4">
                <div className="font-semibold text-gray-800 mb-5 p-1 text-lg inline rounded-lg bg-[#BFDBFE]">Patient Information</div>
                <div className="grid grid-row-4 gap-2 text-xl mt-2">
                  <div className="flex justify-between">
                    <div>
                      Name: <span className="font-medium">{invoiceFetch?.medicalReportId.appointmentId.patientId.name}</span>
                    </div>
                    <div>
                      DOB: <span className="font-medium">
                        {dayjs(invoiceFetch?.medicalReportId.appointmentId.patientId.birthdate).format("DD/MM/YYYY")}
                      </span>
                    </div>
                    <div>
                      Gender: <span className="font-medium">
                        {invoiceFetch?.medicalReportId.appointmentId.patientId.gender}
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <div>
                      Phone: <span className="font-medium">
                        {invoiceFetch?.medicalReportId.appointmentId.patientId.phone}
                      </span>
                    </div>
                    <div>
                      Email: <span className="font-medium">
                        {invoiceFetch?.medicalReportId.appointmentId.patientId.email}
                      </span>
                    </div>
                  </div>
                  <div>
                    <div>
                      Address: <span className="font-medium">
                        {invoiceFetch?.medicalReportId.appointmentId.patientId.address}
                      </span>
                    </div>
                  </div>

                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="font-semibold text-gray-800 mb-5 p-1 text-lg inline rounded-lg bg-[#BFDBFE]">
                  Attending Physician
                </div>
                <div className="grid grid-row-4 gap-4 text-xl mt-2 ">
                  <div className="flex justify-between">
                    <div>
                      <p className="font-medium">Dr. {invoiceFetch?.medicalReportId?.appointmentId?.doctor.name}</p>
                      <p className="text-gray-600">Internal Medicine</p>
                    </div>
                    <div>
                      <p className="text-gray-600 mr-4">{invoiceFetch?.medicalReportId?.appointmentId?.doctor.phone}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">{invoiceFetch?.medicalReportId?.appointmentId?.doctor.email}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardContent className="p-4">
              <div className="font-semibold text-gray-800 mb-5 p-1 text-lg inline rounded-lg bg-[#BFDBFE]">Invoice Details</div>
              <div className="grid grid-cols-1 gap-3 text-xl mt-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Invoice Date:</span>
                  <span className="font-medium">{dayjs(invoiceFetch?.issueDate).format("DD/MM/YYYY")}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Due Date:</span>
                  <span className="font-medium">{dayjs(invoiceFetch?.dueDate).format("DD/MM/YYYY")}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <span
                    className={`font-medium px-2 py-1 rounded-lg text-lg w-[100px] flex items-center justify-center
                       ${invoiceFetch?.status === "paid"
                        ? "bg-green-100 text-green-800 "
                        : invoiceFetch?.status === "cancelled"
                          ? "bg-[#FFF2F0] text-[#FF4D4F]"
                          : "bg-[#E6F4FF] text-[#1677FF]"
                      }`}
                  >
                    {invoiceFetch?.status
                      ? invoiceFetch.status.charAt(0).toUpperCase() + invoiceFetch.status.slice(1)
                      : ""}
                  </span>
                </div>
                <div className="flex justify-between border-t pt-3 mt-2">
                  <span className="text-gray-600 font-medium">Amount Due:</span>
                  <span style={{
                    color: "#60A5FA",
                    fontSize: 30,
                    fontWeight: 700
                  }}>${invoiceFetch?.totalAmount}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mb-8">
          <div className="font-semibold text-gray-800 mb-5 p-1 text-xl inline rounded-lg bg-[#BFDBFE]">
            Consultation Fee
          </div>

          {/* <h3 className="text-xl font-semibold text-gray-800 mb-3">Consultation Fee</h3> */}
          <Card className="mt-4">
            <CardContent className="p-4">
              <div className="flex justify-between items-center text-xl">
                <div>
                  <p className="font-medium">Medical Consultation Fee</p>
                  <p className="text-xl text-gray-600">Examination date: <span className="font-medium">
                    {dayjs(invoiceFetch?.medicalReportId?.examinationDate).format("DD/MM/YYYY")}
                  </span>
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold">${invoiceFetch?.consultationFee}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mb-8">
          {invoiceFetch?.prescriptionId ?
            (
              <>
                <div className="font-semibold text-gray-800 mb-5 p-1 text-xl inline rounded-lg bg-[#BFDBFE]">
                  Prescriptions
                </div>
                <div className="space-y-4 mt-4">
                  {invoiceFetch?.prescriptionId?.details.map((prescription) => (
                    <Card key={prescription.medicineName}>
                      <CardContent className="p-4">
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                          <div className="md:col-span-6">
                            <div>
                              <h4 className="font-semibold text-gray-800 text-lg">{prescription.medicineName}</h4>
                              <p className="text-lg text-gray-600">Unit: {prescription.unit}</p>
                              <p className="text-lg text-gray-600">Dosage: {prescription.dosage}</p>
                              <p className="text-lg text-gray-600">Duration: {prescription.duration} days</p>
                            </div>
                          </div>
                          <div className="md:col-span-4">
                            <p className="text-lg text-gray-600">Quantity: {prescription.quantity}</p>
                            <p className="text-lg text-gray-600 mt-2">
                              <span className="font-medium">Instructions:</span>
                            </p>
                            <p className="text-lg text-gray-600">{prescription.usageMethodName}</p>
                          </div>
                          <div className="md:col-span-2 text-right">
                            <p className="text-xl font-semibold">${(prescription.price || 0) * prescription.quantity}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}

                  <Card className="mt-4">
                    <CardContent className="p-2">
                      <div className="flex justify-start items-center text-xl">
                        <div>
                          <p className="mr-2 font-medium">Prescribing Doctor:</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xl ">Dr. {invoiceFetch?.prescriptionId?.prescribeByDoctor?.name}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </>
            )
            : ""}
        </div>

        <div className="flex justify-end mb-8 text-xl">
          <div className="w-96">
            <div className="bg-gray-50 rounded-lg">
              <div className="p-4">
                <div className="flex justify-between py-2">
                  <span className="text-gray-600">Consultation Fee:</span>
                  <span className="text-2xl">${invoiceFetch?.consultationFee}</span>
                </div>

                <div className="flex justify-between py-2">
                  <span className="text-gray-600">Prescriptions:</span>
                  <span className="text-2xl">
                    ${`${invoiceFetch?.prescriptionId?.totalPrice ? (invoiceFetch?.prescriptionId?.totalPrice) : "0"}`}
                  </span>
                </div>
                <div className="flex justify-between py-2 border-t border-gray-200">
                  <span className="text-gray-600">Subtotal:</span>
                  <span className="text-2xl" >${invoiceFetch?.totalAmount}</span>
                </div>
              </div>
              <div className="flex pl-4 pr-4 justify-between py-3 rounded-md border-t-2 border-gray-300 font-bold text-lg bg-[#BFDBFE]">
                <span>Total Amount Due:</span>
                <span className="text-2xl" >${invoiceFetch?.totalAmount}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-4 mb-8">
          <div className="mb-4">
            <h4 className="font-semibold mb-2 text-xl">Payment Terms</h4>
            <p className="text-lg text-gray-600">Due within 30 days of receipt</p>
          </div>
          <div className="mb-4">
            <h4 className="font-semibold mb-2">Payment Methods</h4>
            <p className="text-lg text-gray-600">Credit Card, Check, Online Payment, Insurance</p>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Notes</h4>
            <p className="text-lg text-gray-600">Please reference your invoice number when making a payment. For questions regarding this invoice, contact our billing department.</p>
          </div>
        </div>

        <div className="print:hidden flex justify-end gap-4">
          <Button onClick={handleBack} className="font-medium">
            Go back
          </Button>
          <Button className="bg-[#BFDBFE] font-medium" onClick={handlePrint}>
            <Printer className="mr-2 h-4 w-4" />
            Print Invoice
          </Button>

        </div>
      </div>
    </div>
  )
}
export default ViewInvoicePage