import { PoolClient } from "pg";

export interface Document {
  id: number;
  name: string;
  data: Buffer;
  otdel_id: number;
}

export async function storeDocument(
  client: PoolClient,
  name: string,
  data: Buffer,
  otdel_id: number
): Promise<Document> {
  const query = `
    INSERT INTO documents (name, data, otdel_id)
    VALUES ($1, $2, $3)
    RETURNING id, name, data, otdel_id;
  `;
  const result = await client.query(query, [name, data, otdel_id]);
  return result.rows[0];
}

export async function getDocumentById(
  client: PoolClient,
  id: number
): Promise<Document> {
  const query = "SELECT id, name, data, otdel_id FROM documents WHERE id = $1";
  const result = await client.query(query, [id]);
  return result.rows[0] || null;
}

export async function getDocumentsByOrdelId(
  client: PoolClient,
  ordel_id: number
): Promise<Document[]> {
  const query = "SELECT id, name, data, otdel_id FROM documents WHERE otdel_id = $1";
  const result = await client.query(query, [ordel_id]);
  return result.rows;
}

export async function deleteDocument(
  client: PoolClient,
  id: number
): Promise<boolean> {
  const query = "DELETE FROM documents WHERE id = $1";
  const result = await client.query(query, [id]);

  return result.rowCount ? result.rowCount > 0 : false;
}
