import { PoolClient } from 'pg';
import { IDataNews } from '@/app/api/controllers/news/Inew';

export async function createNews(client: PoolClient, data: Omit<IDataNews, 'id'>): Promise<number> {
  const query = `
    INSERT INTO "news" (title, text, publish_date, organization_id, is_published)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING id
  `;
  const values = [data.title, data.text, data.publish_date, data.organization_id, data.is_published];
  const result = await client.query(query, values);
  return result.rows[0].id;
}

export async function deleteNews(client: PoolClient, newsId: number): Promise<boolean> {
    const query = `DELETE FROM "news" WHERE id = $1`;
    const result = await client.query(query, [newsId]);
    return (result.rowCount ?? 0) > 0;
}

export async function updateNews(
    client: PoolClient,
    newsId: number,
    data: Partial<Omit<IDataNews, 'id'>>
  ): Promise<boolean> {
    const fields = Object.keys(data);
    if (fields.length === 0) return false;
  
    const updates = fields.map((key, i) => `"${key}" = $${i + 2}`).join(', ');
    const values = [newsId, ...fields.map((key) => (data as any)[key])];
  
    const query = `UPDATE "news" SET ${updates} WHERE id = $1`;
    await client.query(query, values);
    return true;
  }
    