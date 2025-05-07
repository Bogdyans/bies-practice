import { NextRequest, NextResponse } from "next/server";
import Jwt from "@/lib/jwt";
import UserController from "@/controllers/user";

export async function GET(request: NextRequest) {
  const decoded = await Jwt.getDecoded(request);
  if (!decoded) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  try {
    const otdelId = await UserController.getUserOtdelById(decoded.id);

    return NextResponse.json({ otdel_id: otdelId }, { status: 200 });
  } catch {
    return NextResponse.json(
      { error: "Error getting profile" },
      { status: 500 }
    );
  }
}
