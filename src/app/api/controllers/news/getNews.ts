// controllers/news/getNews.ts
import { IDataNews } from '@/app/api/controllers/news/Inew';
import { getNews } from '../../models/news';
import pool from '@/app/api/controllers/connect_to_bd/conectToBd';

export async function fetchNews(userId: number): Promise<{ news: IDataNews[] } | { error: string }> {
  const client = await pool.connect();
  try {
    console.log('Fetching news for user ID:', userId);
    
    const news = await getNews(client, userId);

    if (!news || news.length === 0) {
      console.log('No news found for user ID:', userId);
      return { error: 'News not found' };
    }

    console.log(`Found ${news.length} news items`);
    return { news };

  } catch (error) {
    console.error('Database query error:', error);
    return { error: 'Internal Server Error' };
  } finally {
    client.release();
  }
}