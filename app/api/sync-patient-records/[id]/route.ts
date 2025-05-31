import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import { addData } from "@/lib/utils";

export async function GET() {
  try {
    await dbConnect();
    await addData();
    return NextResponse.json({ message: "Data added successfully" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to add data" }, { status: 500 });
  }
}