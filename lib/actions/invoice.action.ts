import dbConnect from "../mongoose";
import Invoice from "@/database/invoice.model";
import { getPrescriptionDetailsById } from "./prescription.action";
import { Session } from "inspector/promises";
import { formatDate, getDateRange } from "../utils";

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

export async function getInvoiceById(invoiceId: string) {
  try {
    if (!invoiceId) {
      console.log("Null invoice Id");
      return null;
    }
    const invoice = await Invoice.findById(invoiceId)
      .lean();
    if (!invoice) {
      console.log("Invoice find id error");
      return null;
    }
    return JSON.parse(JSON.stringify(invoice));

  } catch (error) {
    console.log("Error get invoice by id", error);
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

  // console.log("prescription data", prescription)

  // Get prescription details for invoice
  const prescriptionDetails = await getPrescriptionDetailsById(prescription._id.toString(), session);
  if (!prescriptionDetails) {
    console.log("No prescription details found");
    throw new Error("Not found prescription details")
  }

  // Create details[] for invoice
  const invoicePrescriptionDetails = prescriptionDetails
    .filter((invoiceDetail: any) => !invoiceDetail.deleted)
    .map((invoiceDetail: any) => ({
      medicineName: invoiceDetail.medicineId.name,
      usageMethodName: invoiceDetail.usageMethodId.name,
      duration: invoiceDetail.duration,
      dosage: `Morning: ${invoiceDetail.morningDosage}, Noon: ${invoiceDetail.noonDosage}, Afternoon: ${invoiceDetail.afternoonDosage}, Evening: ${invoiceDetail.eveningDosage}`,
      quantity: invoiceDetail.quantity,
      price: invoiceDetail.price,
      unit: invoiceDetail.medicineId.unit
    }))

  console.log("invoice details", invoicePrescriptionDetails);

  // Update invoice
  const invoice = await Invoice.findOne(
    { "medicalReportId._id": medicalReportId },
    null,
    session ? { session } : {}
  );
  if (!invoice) {
    console.log(`No invoice found for MedicalReport ${medicalReportId} at invoice.action.ts`)
    throw new Error(`No invoice found for MedicalReport ${medicalReportId}`);

  }
  invoice.prescriptionId = {
    _id: prescription._id,
    code: prescription.code,
    totalPrice: prescription.totalPrice || 0,
    isPaid: prescription.isPaid,
    prescribeByDoctor: prescription.prescribeByDoctor ? {
      _id: prescription.prescribeByDoctor._id,
      name: prescription.prescribeByDoctor.name,
    } : undefined,
    details: invoicePrescriptionDetails
  }
  invoice.medicationFee = prescription.totalPrice || 0;
  invoice.totalAmount = invoice.consultationFee + invoice.medicationFee;

  console.log("invoice before save with prescription", invoice.toObject())
  await invoice.save(session ? { session } : {});
  console.log(`Invoice ${invoice.code} updated with Prescription ${prescription._id}`);
}
interface UpdateStatusInvoiceParams {
  invoiceId: string,
  status: string
}

export const updateStatusInvoice = async ({ invoiceId, status }: UpdateStatusInvoiceParams) => {
  try {
    await dbConnect();

    const updateData = status === 'paid'
      ? { status, paidAt: new Date() }
      : { status };


    const invoice = Invoice.findOneAndUpdate(
      { _id: invoiceId },
      { $set: updateData },
      { new: true, runValidators: true }
    )
    if (!invoice) {
      throw new Error("Invoice not found to update status")
    }
    return invoice;
  } catch (error) {
    console.error('Error updating invoice status:', error);
    throw new Error('Failed to update invoice status');
  }
}

// remove Prescription from Invoice
export const removePrescriptionFromInvoice = async ({
  medicalReportId,
  session = null,
}: {
  medicalReportId: string,
  session: any;
}) => {
  try {
    // Find invoice
    const invoice = await Invoice.findOne(
      { "medicalReportId._id": medicalReportId },
      null,
      session ? { session } : {}
    )
    if (!invoice) {
      console.log("Not found invoice to delete prescription at invoice.action.ts")
      return;
    }

    // Remove prescription and reset fees
    invoice.prescriptionId = undefined;
    invoice.medicationFee = 0;
    invoice.totalAmount = invoice.consultationFee;
    console.log("Invoice before save after moving prescription", invoice.toObject());
    await invoice.save(session ? { session } : {});
    console.log("Invoice updated after moving prescription", invoice.toObject());
  } catch (error) {
    console.log("Error removing prescription from invoice", error);
    throw error
  }
}

// delete invoice
export const deleteInvoice = async (invoiceId: string) => {
  try {
    await dbConnect();

    if (!invoiceId) {
      console.log("Not found invoiceId");
      throw new Error("Not found invoiceId")
    }
    const invoice = await Invoice.updateOne(
      { _id: invoiceId },
      { $set: { deleted: true, deletedAt: new Date() }, },
      { new: true, runValidators: true }
    )
    if (!invoice) {
      console.log("Not found invoice to delete")
    }
    return { success: true };
  } catch (error) {
    console.log("Error delete invoice action", error)
  }
}

// Get revenue
export async function getRevenueFromInvoice(fromDate: Date, toDate: Date) {
  await dbConnect();

  const invoices = await Invoice.find({
    status: "paid",
    paidAt: {
      $gte: fromDate,
      $lte: toDate,
    },
    deleted: false
  }).lean();

  // Gom chi phí theo ngày
  const revenueMap = new Map<string, number>();
  for (const invoice of invoices) {
    console.log("invoice", invoice)
    const date = formatDate(new Date(invoice.paidAt));
    const value = invoice.totalAmount || 0;
    revenueMap.set(date, (revenueMap.get(date) || 0) + value);
  }


  // Đảm bảo có đủ ngày trong khoảng, kể cả khi value = 0
  const allDates = getDateRange(fromDate, toDate);
  const result = allDates.map((date) => ({
    date,
    value: revenueMap.get(date) || 0,
    type: "revenue" as const,
  }));
  console.log("Rs", result)

  return result;
}

export async function restoreAllInvoices() {
  return await Invoice.updateMany({ deleted: true }, { deleted: false });
}