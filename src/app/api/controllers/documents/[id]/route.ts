import { NextRequest, NextResponse } from "next/server";
import {
  fetchDocumentById,
  removeDocument,
} from "@/app/api/controllers/documents/[id]/documents_controller";

// Получение конкретного документа по ID
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params;
    const documentId = parseInt(id);
    if (isNaN(documentId)) {
      return NextResponse.json(
        { error: "Invalid document ID" },
        { status: 400 }
      );
    }
    const result = await fetchDocumentById(documentId);

    if ("error" in result) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    const document = result.document;

    // Возвращаем PDF с правильными заголовками
    return new NextResponse(document.data, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename="${encodeURIComponent(document.name)}"`,
        "X-Document-Name": encodeURIComponent(document.name),
      },
    });
  } catch (error) {
    console.error("Error fetching document:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// Удаление документа по ID
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params;
    const documentId = parseInt(id);
    if (isNaN(documentId)) {
      return NextResponse.json(
        { error: "Invalid document ID" },
        { status: 400 }
      );
    }

    const result = await removeDocument(documentId);

    if ("error" in result) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    } else {
      return NextResponse.json(
        { message: "Document deleted successfully" },
        { status: 200 }
      );
    }
  } catch (error) {
    console.error("Error deleting document:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
