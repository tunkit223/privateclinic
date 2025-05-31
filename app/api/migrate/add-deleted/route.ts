// app/api/migrate/add-deleted/route.ts
import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose"; // đường dẫn đến dbConnect bạn dùng
import Patient from "@/database/patient.model"; // model bạn đã có

export async function GET() {
  try {
    await dbConnect();

    const result = await Patient.updateMany(
      { deleted: { $exists: false } }, // chỉ update những bản ghi chưa có trường deleted
      { $set: { deleted: false, deletedAt: null } }
    );

    return NextResponse.json({
      success: true,
      message: `Đã cập nhật ${result.modifiedCount} bản ghi.`,
    });
  } catch (error) {
    console.error("Migration error:", error);
    return NextResponse.json({ success: false, message: "Migration failed." }, { status: 500 });
  }
}
