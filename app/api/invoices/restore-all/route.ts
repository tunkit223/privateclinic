import { NextResponse } from "next/server";
import { restoreAllInvoices } from "@/lib/actions/invoice.action";

export async function PATCH() {
  try {
    await restoreAllInvoices();
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to restore invoices" }, { status: 500 });
  }
}
