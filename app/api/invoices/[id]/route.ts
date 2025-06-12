import { getInvoiceById } from "@/lib/actions/invoice.action";
import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";


export async function GET(request: Request,
  { params }: { params: Promise<{ id: string }> }) {
  try {

    const { id: invoiceId } = await params;
    if (!invoiceId || invoiceId === "undefined") {
      return NextResponse.json(
        { error: "Invalid invoice ID" },
        { status: 400 }
      );
    }
    const invoice = await getInvoiceById(invoiceId);

    if (!invoice) {
      return NextResponse.json(
        { error: "Invoice not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(invoice)

  } catch (error) {
    console.log("Error fetching invoice", error)
    return NextResponse.json(
      { error: "Internal sever error" },
      { status: 500 }
    )
  }
}