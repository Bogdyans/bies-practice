import { NextRequest, NextResponse } from "next/server";
import DocumentController from "@/controllers/documents";
import fs from "fs";
import Jwt from "@/lib/jwt";
import path from "path";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const decoded = await Jwt.getDecoded(request);
  if (!decoded || !("id" in decoded)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const documentId = parseInt(id);

  if (isNaN(documentId)) {
    return NextResponse.json({ error: "Invalid document ID" }, { status: 400 });
  }
  try {
    const result = await DocumentController.fetchDocumentById(documentId);

    if ("error" in result) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    const document = result.document;

    if (!fs.existsSync(document.file_path)) {
      return NextResponse.json(
        { error: "File not found on server" },
        { status: 404 }
      );
    }

    const fileData = fs.readFileSync(document.file_path);
    const fileExt = path.extname(document.name).toLowerCase();
    const isPdf = fileExt === ".pdf";

    const mimeTypes: Record<string, string> = {
      ".pdf": "application/pdf",
      ".jpg": "image/jpeg",
      ".jpeg": "image/jpeg",
      ".png": "image/png",
      ".gif": "image/gif",
      ".txt": "text/plain",
      ".zip": "application/zip",
      ".rar": "application/x-rar-compressed",
      ".7z": "application/x-7z-compressed",
    };

    const contentType = mimeTypes[fileExt] || "application/octet-stream";

    const contentDisposition = isPdf
      ? `inline; filename="${encodeURIComponent(document.name)}`
      : `attachment; filename="${encodeURIComponent(document.name)}"`;

    return new NextResponse(fileData, {
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": contentDisposition,
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

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const decoded = await Jwt.getDecoded(request);
  if (!decoded || !("id" in decoded)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const documentId = parseInt(id);

  if (isNaN(documentId)) {
    return NextResponse.json(
      { error: "Invalid document ID" },

      { status: 400 }
    );
  }
  try {
    const docResult = await DocumentController.fetchDocumentById(documentId);
    if ("error" in docResult) {
      return NextResponse.json({ error: docResult.error }, { status: 500 });
    }

    const result = await DocumentController.removeDocument(documentId);

    try {
      if (fs.existsSync(docResult.document.file_path)) {
        fs.unlinkSync(docResult.document.file_path);
      }
    } catch (fileError) {
      console.error("Error deleting document file: ", fileError);
    }

    if ("error" in result) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }
    return NextResponse.json(
      { message: "Document deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting document:", error);

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
