import { deleteInvoice } from "@/lib/actions/invoice.action";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { invoiceId } = await request.json();
    if (!invoiceId) {
      return NextResponse.json(
        { error: 'Missing invoiceId' },
        { status: 400 }
      );
    }
    const result = await deleteInvoice(invoiceId);
    return NextResponse.json(result, { status: 200 });


  } catch (error: any) {
    console.error('Error in delete invoice API:', error.message);
    return NextResponse.json(
      { error: `Failed to delete invoice: ${error.message}` },
      { status: 500 }
    );
  }
}