// app/api/documents/route.ts
import { NextRequest, NextResponse } from "next/server";
import {
  fetchDocumentsByOrdelId,
  saveDocument,
} from "@/app/api/controllers/documents/documents_controller";

// Получение списка документов по otdel_id
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const otdel_id = searchParams.get("otdel_id")
      ? parseInt(searchParams.get("otdel_id")!)
      : undefined;

    if (!otdel_id || isNaN(Number(otdel_id))) {
      return NextResponse.json({ error: "Invalid ordel_id" }, { status: 400 });
    }

    const result = await fetchDocumentsByOrdelId(otdel_id);

    if ("error" in result) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    return NextResponse.json({ documents: result.documents }, { status: 200 });
  } catch (error) {
    console.error("Contacts API error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// Загрузка нового документа
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const otdel_id = formData.get("otdel_id")
      ? Number(formData.get("otdel_id"))
      : null;
    const name = formData.get("name") ? String(formData.get("name")) : null;
    const file = formData.get("file") as File | null;

    if (!otdel_id || !name || !file) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (isNaN(Number(otdel_id))) {
      return NextResponse.json({ error: "Invalid otdel_id" }, { status: 400 });
    }

    const fileBuffer = Buffer.from(await file.arrayBuffer());

    const result = await saveDocument(name, fileBuffer, otdel_id);

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error("Documents API error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
