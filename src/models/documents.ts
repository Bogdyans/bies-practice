import { PoolClient } from "pg";
import { Document } from "@/types/document";

export default class DocumentModel {
  static async storeDocument(
    client: PoolClient,
    name: string,
    file_path: string,
    otdel_id: number | null,
    uploaded_by: number,
    description: string | null,
    is_archived: boolean
  ): Promise<Document> {
    const query = ` INSERT INTO documents (name, file_path, otdel_id, uploaded_by, description, is_archived) 
    VALUES ($1, $2, $3, $4, $5, $6) 
    RETURNING id, name, file_path, otdel_id, uploaded_by, uploaded_at, description, is_archived`;
    const result = await client.query(query, [
      name,
      file_path,
      otdel_id,
      uploaded_by,
      description,
      is_archived,
    ]);
    return result.rows[0];
  }

  static async getDocumentById(
    client: PoolClient,
    id: number
  ): Promise<Document | null> {
    const query = `SELECT id, name, file_path, otdel_id, uploaded_by, uploaded_at, description, is_archived
      FROM documents 
      WHERE id = $1`;

    const result = await client.query(query, [id]);
    return result.rows[0] || null;
  }

  static async getDocumentsByOrdelId(
    client: PoolClient,
    ordel_id: number
  ): Promise<Document[]> {
    const query = `SELECT id, name, file_path, otdel_id, uploaded_by, uploaded_at, description, is_archived
      FROM documents 
      WHERE otdel_id = $1`;

    const result = await client.query(query, [ordel_id]);
    return result.rows;
  }

  static async deleteDocument(
    client: PoolClient,
    id: number
  ): Promise<boolean> {
    const query = "DELETE FROM documents WHERE id = $1";
    const result = await client.query(query, [id]);
    return result.rowCount ? result.rowCount > 0 : false;
  }
}
