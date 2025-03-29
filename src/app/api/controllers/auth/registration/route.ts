import { NextRequest, NextResponse } from "next/server";
import pool from "@/app/api/controllers/connect_to_bd/conectToBd";

export async function POST(request: NextRequest): Promise<NextResponse> {
  const client = await pool.connect();
  try {
    return NextResponse.json({ message: "Registration successful" });
  } catch (error) {
    console.error("Register error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}
