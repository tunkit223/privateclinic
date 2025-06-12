import { updateStatusInvoice } from "@/lib/actions/invoice.action";
import { message } from "antd";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { invoiceId, status } = await request.json();

    if (!invoiceId || !status) {
      return NextResponse.json(
        { error: "Missing invoice ID or status in api" },
        { status: 400 }
      )
    }
    const updatedInvoice = await updateStatusInvoice({ invoiceId, status })
    return NextResponse.json(
      { message: "Invoice status updated", data: updatedInvoice },
      { status: 200 }
    )
  } catch (error) {
    console.log("Error updating status invoice in API");
    return NextResponse.json(
      { error: "Failed to update invoice status" },
      { status: 500 }
    )
  }
}