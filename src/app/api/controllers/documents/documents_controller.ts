import pool from "@/app/api/controllers/connect_to_bd/conectToBd";
import {
  getDocumentsByOrdelId,
  storeDocument,
} from "@/app/api/models/documents";
import { Document } from "./IDocuments";

export async function fetchDocumentsByOrdelId(
  otdel_id: number
): Promise<{ documents: Document[] } | { error: string }> {
  const client = await pool.connect();
  try {
    const documents = await getDocumentsByOrdelId(client, otdel_id);
    return { documents };
  } catch (error) {
    console.error("Error fetching documents:", error);
    return { error: "Failed to fetch documents" };
  } finally {
    client.release();
  }
}

export async function saveDocument(
  name: string,
  data: Buffer,
  otdel_id: number
) {
  const client = await pool.connect();
  try {
    const document = await storeDocument(client, name, data, otdel_id);
    return { document };
  } catch (error) {
    console.error("Error fetching documents:", error);
    return { error: "Failed to fetch documents" };
  } finally {
    client.release();
  }
}
