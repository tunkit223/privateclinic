import { NextRequest, NextResponse } from "next/server";
import { renderToStream } from "@react-pdf/renderer";
import dbConnect from "@/lib/mongoose";
import Prescription from "@/database/prescription.model";
import { PrescriptionDocument } from "@/components/PDF/PrescriptionDocument";

// GET /api/prescription/:id/pdf
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  await dbConnect()

  const prescription = await Prescription.findById(params.id)
    .populate("prescribeByDoctor")
    .populate({
      path: "medicalReportId",
      populate: {
        path: "appointmentId",
        populate: {
          path: "patientId"
        }
      }
    });

  if (!prescription) {
    return NextResponse.json({ error: "Prescription not found" }, { status: 404 });
  }

  const stream = await renderToStream(<PrescriptionDocument prescription={prescription} />);

  return new NextResponse(stream as any, {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${prescription.code}.pdf"`
    }
  });
}