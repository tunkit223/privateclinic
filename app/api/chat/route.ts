
import { NextRequest, NextResponse } from "next/server";
import { askBot } from "@/lib/ask";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const answer = await askBot(body.message);
  return NextResponse.json({ answer });
}
