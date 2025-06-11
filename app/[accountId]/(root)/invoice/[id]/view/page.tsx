"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Printer, Download } from "lucide-react"
import { format } from "date-fns"
function ViewInvoicePage() {
  const [invoiceData] = useState({
    invoiceNumber: "INV-2023-0042",
    status: "Unpaid", // có thể là "Paid", "Unpaid", "Overdue", "Partial Payment"
    date: new Date(),
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    clinic: {
      name: "HealthCare Medical Clinic",
      address: "123 Healing Way, Medical District",
      city: "San Francisco, CA 94103",
      phone: "(555) 123-4567",
      email: "billing@healthcaremedical.com",
      website: "www.healthcaremedical.com",
    },
    doctor: {
      name: "Dr. Sarah Johnson",
      specialty: "Internal Medicine",
      licenseNumber: "MD-12345",
      phone: "(555) 123-4568",
      email: "dr.johnson@healthcaremedical.com",
    },
    patient: {
      name: "John Doe",
      id: "PT-10042",
      address: "456 Patient Lane",
      city: "San Francisco, CA 94101",
      phone: "(555) 987-6543",
      email: "john.doe@example.com",
      dateOfBirth: "1985-03-15",
      insuranceId: "INS-789456",
    },
    consultantFee: {
      description: "Medical Consultation Fee",
      duration: "45 minutes",
      rate: 200.0,
      amount: 200.0,
    },
    services: [
      {
        id: 1,
        description: "Complete Blood Count (CBC)",
        code: "85027",
        quantity: 1,
        unitPrice: 45.0,
      },
      {
        id: 2,
        description: "X-Ray - Chest (2 views)",
        code: "71046",
        quantity: 1,
        unitPrice: 220.0,
      },
      {
        id: 3,
        description: "Urinalysis",
        code: "81001",
        quantity: 1,
        unitPrice: 35.0,
      },
    ],
    prescriptions: [
      {
        id: 1,
        medicationName: "Amoxicillin 500mg",
        dosage: "500mg",
        frequency: "3 times daily",
        duration: "7 days",
        quantity: 21,
        instructions: "Take with food. Complete full course.",
        cost: 25.0,
      },
      {
        id: 2,
        medicationName: "Ibuprofen 400mg",
        dosage: "400mg",
        frequency: "As needed",
        duration: "10 days",
        quantity: 20,
        instructions: "Take for pain relief. Do not exceed 3 tablets per day.",
        cost: 15.0,
      },
      {
        id: 3,
        medicationName: "Vitamin D3 1000 IU",
        dosage: "1000 IU",
        frequency: "Once daily",
        duration: "30 days",
        quantity: 30,
        instructions: "Take with breakfast.",
        cost: 18.0,
      },
    ],
    subtotal: 558.0,
    tax: 0,
    discount: 0,
    total: 558.0,
    paymentTerms: "Due within 30 days of receipt",
    paymentMethods: "Credit Card, Check, Online Payment, Insurance",
    notes:
      "Please reference your invoice number when making a payment. For questions regarding this invoice, contact our billing department.",
    paymentDate: null, // sẽ có giá trị khi đã thanh toán
    amountPaid: 0, // số tiền đã thanh toán
  })

  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 print:bg-white print:py-0">
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
            <p className="text-gray-600 mt-1 text-lg">#{invoiceData.invoiceNumber}</p>
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
                      Name: <span className="font-medium">{invoiceData.patient.name}</span>
                    </div>
                    <div>
                      DOB: <span className="font-medium">{invoiceData.patient.dateOfBirth}</span>
                    </div>
                    <div>
                      Gender: <span className="font-medium">Male</span>
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <div>
                      Phone: <span className="font-medium">{invoiceData.patient.email}</span>
                    </div>
                    <div>
                      Email: <span className="font-medium">{invoiceData.patient.email}</span>
                    </div>
                  </div>
                  <div>
                    <div>
                      Address: <span className="font-medium">{invoiceData.patient.email}</span>
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
                      <p className="font-medium">{invoiceData.doctor.name}</p>
                      <p className="text-gray-600">{invoiceData.doctor.specialty}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">{invoiceData.doctor.phone}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">{invoiceData.doctor.email}</p>
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
                  <span className="font-medium">{format(invoiceData.date, "MMM dd, yyyy")}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Due Date:</span>
                  <span className="font-medium">{format(invoiceData.dueDate, "MMM dd, yyyy")}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <span
                    className={`font-medium px-2 py-1 rounded-full text-lg ${invoiceData.status === "Paid"
                      ? "bg-green-100 text-green-800"
                      : invoiceData.status === "Overdue"
                        ? "bg-red-100 text-red-800"
                        : invoiceData.status === "Partial Payment"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                  >
                    {invoiceData.status}
                  </span>
                </div>
                <div className="flex justify-between border-t pt-3 mt-2">
                  <span className="text-gray-600 font-medium">Amount Due:</span>
                  <span style={{
                    color: "#60A5FA",
                    fontSize: 30,
                    fontWeight: 700
                  }}>${invoiceData.total.toFixed(2)}</span>
                </div>
                {invoiceData.status === "Partial Payment" && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Amount Paid:</span>
                    <span>${invoiceData.amountPaid.toFixed(2)}</span>
                  </div>
                )}
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
                  <p className="font-medium">{invoiceData.consultantFee.description}</p>
                  <p className="text-xl text-gray-600">Examination Date: ${invoiceData.consultantFee.rate}/hour</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold">${invoiceData.consultantFee.amount.toFixed(2)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mb-8">
          <div className="font-semibold text-gray-800 mb-5 p-1 text-xl inline rounded-lg bg-[#BFDBFE]">
            Prescriptions
          </div>
          <div className="space-y-4 mt-4">
            {invoiceData.prescriptions.map((prescription) => (
              <Card key={prescription.id}>
                <CardContent className="p-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <h4 className="font-semibold text-gray-800 text-lg">{prescription.medicationName}</h4>
                      <p className="text-lg text-gray-600">Unit: {prescription.frequency}</p>
                      <p className="text-lg text-gray-600">Dosage: {prescription.dosage}</p>
                      <p className="text-lg text-gray-600">Duration: {prescription.duration}</p>
                    </div>
                    <div>
                      <p className="text-lg text-gray-600">Quantity: {prescription.quantity}</p>
                      <p className="text-lg text-gray-600 mt-2">
                        <span className="font-medium">Instructions:</span>
                      </p>
                      <p className="text-lg text-gray-600">{prescription.instructions}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-semibold">${prescription.cost.toFixed(2)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="flex justify-end mb-8 text-xl">
          <div className="w-96">
            <div className="bg-gray-50 rounded-lg">
              <div className="p-4">
                <div className="flex justify-between py-2">
                  <span className="text-gray-600">Consultation Fee:</span>
                  <span className="text-2xl">${invoiceData.consultantFee.amount.toFixed(2)}</span>
                </div>

                <div className="flex justify-between py-2">
                  <span className="text-gray-600">Prescriptions:</span>
                  <span className="text-2xl">
                    ${invoiceData.prescriptions.reduce((sum, prescription) => sum + prescription.cost, 0).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between py-2 border-t border-gray-200">
                  <span className="text-gray-600">Subtotal:</span>
                  <span className="text-2xl" >${invoiceData.subtotal.toFixed(2)}</span>
                </div>
              </div>
              <div className="flex pl-4 pr-4 justify-between py-3 rounded-md border-t-2 border-gray-300 font-bold text-lg bg-[#BFDBFE]">
                <span>Total Amount Due:</span>
                <span className="text-2xl" >${invoiceData.total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-4 mb-8">
          <div className="mb-4">
            <h4 className="font-semibold mb-2 text-xl">Payment Terms</h4>
            <p className="text-lg text-gray-600">{invoiceData.paymentTerms}</p>
          </div>
          <div className="mb-4">
            <h4 className="font-semibold mb-2">Payment Methods</h4>
            <p className="text-lg text-gray-600">{invoiceData.paymentMethods}</p>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Notes</h4>
            <p className="text-lg text-gray-600">{invoiceData.notes}</p>
          </div>
        </div>

        <div className="print:hidden flex justify-end gap-4">
          <Button variant="outline" onClick={handlePrint}>
            <Printer className="mr-2 h-4 w-4" />
            Print Invoice
          </Button>
          <Button>
            <Download className="mr-2 h-4 w-4" />
            Download PDF
          </Button>
        </div>
      </div>
    </div>
  )
}
export default ViewInvoicePage