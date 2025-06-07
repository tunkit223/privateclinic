import dbConnect from "../mongoose";
import Invoice from "@/database/invoice.model";
import { getPrescriptionDetailsById } from "./prescription.action";

export async function getInvoiceList() {
  try {
    await dbConnect();
    const invoices = await Invoice.find({ deleted: false })
      .lean();

    const data = {
      documents: invoices,
    };
    return JSON.parse(JSON.stringify(data));

  } catch (error) {
    console.log("Error get invoice list", error);
    return null;
  }
}
export async function createInvoice(data: any) {
  try {
    await dbConnect();
    const newInvoice = new Invoice({
      data,
    })
    await newInvoice.save();

  } catch (error) {
    console.log("Error create Invoice in action file", error);
  }
}

export const updateInvoiceWithPrescription = async ({
  medicalReportId,
  prescription,
  session = null,
}: {
  medicalReportId: string,
  prescription: any,
  session: any,
}) => {

  // Get prescription details for invoice
  const prescriptionDetails = await getPrescriptionDetailsById(prescription._id.toString());
  if (!prescriptionDetails) {
    console.log("No prescription details found");
    throw new Error("Not found prescription details")
  }

  // Create details[] for invoice
  const invoicePrescriptionDetails = prescriptionDetails.map((invoiceDetail: any) => ({
    medicineName: invoiceDetail.medicineId.name,
    usageMethodName: invoiceDetail.usageMethodId.name,
    duration: invoiceDetail.duration,
    dosage: `Morning: ${invoiceDetail.morningDosage}, Noon: ${invoiceDetail.noonDosage}, Afternoon: ${invoiceDetail.afternoonDosage}, Evening: ${invoiceDetail.eveningDosage}`,
    quantity: invoiceDetail.quantity,
    price: invoiceDetail.price
  }))

  // Update invoice
  const invoice = await Invoice.findOne(
    { "medicalReportId._id": medicalReportId },
    null,
    session ? { session } : {}
  );
  if (!invoice) {
    console.log(`No invoice found for MedicalReport ${medicalReportId} at invoice.action.ts`)
  }
  invoice.prescriptionId = {
    _id: prescription._id,
    code: prescription.code,
    totalPrice: prescription.totalPrice,
    isPaid: prescription.isPaid,
    details: invoicePrescriptionDetails
  }
  invoice.medicationFee = prescription.totalPrice || 0;
  invoice.totalAmount = invoice.consultationFee + invoice.medicationFee;
  console.log("invoice before save with prescription", invoice.toObject())
  await invoice.save(session ? { session } : {});
  console.log(`Invoice ${invoice.invoiceCode} updated with Prescription ${prescription._id}`);
}