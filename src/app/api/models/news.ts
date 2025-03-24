// models/news.ts
import { PoolClient } from 'pg';
import { IDataNews } from '@/app/api/controllers/news/Inew';

export async function getNews(client: PoolClient, userId: string): Promise<IDataNews[] | null> {
  const query = `
    SELECT 
      n.id AS news_id,
      n.title,
      n.text,
      n.date
    FROM news n
    JOIN Organization o ON n.organization_id = o.id
    JOIN Otdel ot ON o.id = ot.organization_id
    JOIN Users u ON ot.id = u.otdel_id
    WHERE u.id = $1;
  `;
  const values = [userId];
  const result = await client.query(query, values);

  if (result.rows.length > 0) {
    return result.rows as IDataNews[]; // Возвращаем все строки
  } else {
    return null; // Если новости не найдены
  }
}