// controllers/news/getNews.ts
import { DataNews } from '@/app/api/controllers/news/Inew';
import { getNews } from '../../models/news';
import pool from '@/app/api/controllers/connect_to_bd/conectToBd';

export async function fetchNews(Token: string): Promise<{ news: DataNews } | { error: string }> {
  const client = await pool.connect();
  try {
    const news = await getNews(client, Token);

    if (news) {
      return { news };
    } else {
      return { error: 'News not found' };
    }
  } catch (error) {
    console.error('Database query error:', error);
    return { error: 'Internal Server Error'};
  } finally {
    client.release();
  }
}