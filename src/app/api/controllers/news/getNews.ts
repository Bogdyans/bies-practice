// controllers/news/getNews.ts
import { IDataNews } from '@/app/api/controllers/news/Inew';
import { getNews } from '../../models/news';
import pool from '@/app/api/controllers/connect_to_bd/conectToBd';

export async function fetchNews(Token: string): Promise<{ news: IDataNews[] } | { error: string }> {
  const client = await pool.connect();
  try {
    console.log('Fetching news for user ID:', Token); // Логируем ID пользователя
    const news = await getNews(client, Token);

    if (news) {
      console.log('News found:', news); // Логируем найденные новости
      return { news };
    } else {
      console.log('No news found for user ID:', Token); // Логируем, если новости не найдены
      return { error: 'News not found' };
    }
  } catch (error) {
    console.error('Database query error:', error);
    return { error: 'Internal Server Error' };
  } finally {
    client.release();
  }
}