import { NextRequest, NextResponse } from "next/server";
import { decreaseMedicinesFromPrescription } from "@/lib/actions/medicine.action";

export async function POST(req: NextRequest) {
  try {
    const { prescriptionId } = await req.json();
    if (!prescriptionId)
      return NextResponse.json({ error: "Thiếu prescriptionId" }, { status: 400 });

    await decreaseMedicinesFromPrescription(prescriptionId);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Lỗi không xác định" },
      { status: 400 }
    );
  }
}
