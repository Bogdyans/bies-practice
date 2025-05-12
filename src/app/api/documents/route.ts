import { NextRequest, NextResponse } from "next/server";
import Jwt from "@/lib/jwt";
import DocumentController from "@/controllers/documents";

export async function GET(request: NextRequest) {
  const decoded = await Jwt.getDecoded(request);
  if (!decoded || !("id" in decoded)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const otdel_id = searchParams.get("otdel_id")
    ? parseInt(searchParams.get("otdel_id")!)
    : undefined;
  if (!otdel_id || isNaN(Number(otdel_id))) {
    return NextResponse.json({ error: "Invalid otdel_id" }, { status: 500 });
  }

  try {
    const result = await DocumentController.fetchDocumentsByOrdelId(otdel_id);

    if ("error" in result) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    return NextResponse.json({ documents: result.documents }, { status: 200 });
  } catch (error) {
    console.error("Error getting documents: ", error);
    return NextResponse.json(
      { message: "Error getting documents" },
      { status: 400 }
    );
  }
}

export async function POST(request: NextRequest) {
  const decoded = await Jwt.getDecoded(request);
  if (!decoded || !("id" in decoded)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = decoded.id;
  const formData = await request.formData();

  const otdel_id = formData.get("otdel_id")
    ? Number(formData.get("otdel_id"))
    : null;
  const name = formData.get("name") ? String(formData.get("name")) : null;
  const file = formData.get("file") as File | null;
  const description = formData.get("description")
    ? String(formData.get("description"))
    : null;

  if (!otdel_id || !name || !file) {
    return NextResponse.json(
      { error: "Missing required fields" },

      { status: 500 }
    );
  }

  if (isNaN(Number(otdel_id))) {
    return NextResponse.json({ error: "Invalid otdel_id" }, { status: 500 });
  }

  try {
    const fileBuffer = Buffer.from(await file.arrayBuffer());
    const result = await DocumentController.saveDocument(
      name,
      fileBuffer,
      otdel_id,
      userId,
      description
    );

    if ("error" in result) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    return NextResponse.json(result.document, { status: 200 });
  } catch {
    return NextResponse.json(
      { message: "Error posting document" },
      { status: 400 }
    );
  }
}
