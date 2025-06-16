// app/api/dashboard/revenue/route.ts
import { getRevenueFromInvoice } from '@/lib/actions/invoice.action';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {

    const body = await req.json();
    const { fromDate, toDate } = body;

    if (!fromDate || !toDate) {
      return NextResponse.json({ success: false, error: "Missing date parameters" }, { status: 400 });
    }

    const from = new Date(fromDate);
    const to = new Date(toDate);

    if (isNaN(from.getTime()) || isNaN(to.getTime())) {
      return NextResponse.json({ success: false, error: "Invalid date format" }, { status: 400 });
    }

    const revenue = await getRevenueFromInvoice(from, to);

    return NextResponse.json({ success: true, data: revenue });
  } catch (error) {
    console.error("API Error get revenue:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch revenue" }, { status: 500 });
  }
}
