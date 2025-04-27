import { NextResponse } from "next/server";
import { getUserByAccountId } from "@/lib/actions/user.action";

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const user = await getUserByAccountId(params.id);
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }
    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
