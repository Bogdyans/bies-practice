import pool from "@/lib/db";

import DocumentModel from "@/models/documents";
import path from "path";
import fs from "fs";

export interface Document {
  id: number;
  name: string;
  file_path: string;
  otdel_id: number | null;
  uploaded_by: number;
  uploaded_at: Date;
  description: string | null;
}

export default class DocumentController {
  static async fetchDocumentsByOrdelId(
    otdel_id: number
  ): Promise<{ documents: Document[] } | { error: string }> {
    const client = await pool.connect();
    try {
      const documents = await DocumentModel.getDocumentsByOrdelId(
        client,
        otdel_id
      );
      return { documents };
    } catch (error) {
      console.error("Error fetching documents:", error);
      return { error: "Failed to fetch documents" };
    } finally {
      client.release();
    }
  }

  private static checkIfArchive(filename: string): boolean {
    const archiveExtensions = [".zip", ".rar", ".7z", ".tar", ".gz", ".bz2"];
    const ext = path.extname(filename).toLowerCase();
    return archiveExtensions.includes(ext);
  }

  static async saveDocument(
    name: string,
    file: Buffer,
    otdel_id: number,
    uploaded_by: number,
    description: string | null
  ): Promise<{ document: Document } | { error: string }> {
    const client = await pool.connect();

    try {
      const uploadDir = path.join(
        process.cwd(),
        "public",
        "uploads",
        "documents"
      );
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      const fileName = `${Date.now()}-${name.replace(/\s+/g, "_")}`;
      const filePath = path.join(uploadDir, fileName);
      fs.writeFileSync(filePath, file);

      const isArchive = this.checkIfArchive(fileName);

      const document = await DocumentModel.storeDocument(
        client,
        name,
        filePath,
        otdel_id,
        uploaded_by,
        description,
        isArchive
      );
      return { document };
    } catch (error) {
      console.error("Error saving document:", error);
      return { error: "Failed to save document" };
    } finally {
      client.release();
    }
  }

  static async fetchDocumentById(
    id: number
  ): Promise<{ document: Document } | { error: string }> {
    const client = await pool.connect();

    try {
      const document = await DocumentModel.getDocumentById(client, id);

      if (!document) {
        return { error: "Document not found" };
      }

      return { document };
    } catch (error) {
      console.error("Error fetching document:", error);

      return { error: "Failed to fetch document" };
    } finally {
      client.release();
    }
  }

  static async removeDocument(
    id: number
  ): Promise<{ success: boolean } | { error: string }> {
    const client = await pool.connect();

    try {
      const result = await DocumentModel.deleteDocument(client, id);

      return { success: result };
    } catch (error) {
      console.error("Error fetching document:", error);

      return { error: "Failed to fetch document" };
    } finally {
      client.release();
    }
  }
}
