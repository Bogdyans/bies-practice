import pool from "@/app/api/controllers/connect_to_bd/conectToBd";
import {
  getDocumentById,
  deleteDocument,
} from "@/app/api/models/documents";
import { Document } from "@/app/api/controllers/documents/IDocuments"

export async function fetchDocumentById(id: number): Promise<{ document: Document } | { error: string}> {
    const client = await pool.connect();
    try {
        const document = await getDocumentById(client, id);
        return { document };
    } catch (error) {
        console.error("Error fetching document:", error);
        return { error: "Failed to fetch document" };
    } finally {
        client.release();
    }
}

export async function removeDocument(id: number): Promise<{status: boolean} | {error: string}> {
    const client = await pool.connect();
    try {
        const status = await deleteDocument(client, id);
        return { status };
    } catch (error) {
        console.error("Error fetching document:", error);
        return { error: "Failed to fetch document" };
    } finally {
        client.release();
    }
}