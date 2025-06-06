import dbConnect from "../mongoose";
import Invoice from "@/database/invoice.model";

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