import { PoolClient } from 'pg';
import { IDataNews } from '@/app/api/controllers/news/Inew';

export async function getNews(client: PoolClient, userId: number): Promise<IDataNews[] | null> {
  const query = `
    SELECT 
      n.id AS news_id,
      n.title,
      n.text,
      n.publish_date
    FROM "news" n
    JOIN "organization" o ON n.organization_id = o.id
    JOIN "otdel" ot ON o.id = ot.organization_id
    JOIN "userprofile" up ON ot.id = up.otdel_id
    WHERE up.user_id = $1
      AND n.is_published = TRUE
    ORDER BY n.publish_date DESC
  `;
  
  const values = [userId];
  const result = await client.query(query, values);

  return result.rows.length > 0 ? result.rows as IDataNews[] : null;
}
