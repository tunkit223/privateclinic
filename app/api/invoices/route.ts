import { NextResponse } from "next/server"
import { getInvoiceList } from "@/lib/actions/invoice.action"

export async function GET() {
  const result = await getInvoiceList();
  return NextResponse.json(result);
}