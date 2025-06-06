import Bill from "@/database/invoice.model";
import dbConnect from "../mongoose";
import Invoice from "@/database/invoice.model";

export async function getInvoiceList() {
  try {
    await dbConnect();
    const prescription = await Bill.find({ deleted: false })

      .lean();

    const data = {
      documents: prescription,
    };
    return JSON.parse(JSON.stringify(data));

  } catch (error) {
    console.log("Error get prescription", error);
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