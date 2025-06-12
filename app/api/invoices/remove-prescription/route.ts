import { removePrescriptionFromInvoice } from "@/lib/actions/invoice.action";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { medicalReportId, session } = await request.json();
    if (!medicalReportId) {
      return NextResponse.json(
        { error: "Medical report ID is required" },
        { status: 400 }
      )
    }
    await removePrescriptionFromInvoice({
      medicalReportId: medicalReportId.toString(),
      session
    })
    return NextResponse.json(
      { message: "Prescription removed successfully" },
      { status: 200 }
    )
  } catch (error) {
    console.error("Error removing prescription:", error);
    return NextResponse.json(
      { error: "Failed to remove prescription" },
      { status: 500 }
    )
  }
}