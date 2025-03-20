// app/api/controllers/news/route.ts
import { NextResponse } from 'next/server';
import { fetchNews } from '@/app/api/controllers/news/getNews';

export async function POST(request: Request) {
  try {
    const userIdJson = await request.json();

    // Проверяем, что token присутствует в теле запроса
    if (!userIdJson.token) {
      return NextResponse.json({ error: 'token is required', message: 'undefined' }, { status: 400 });
    }

    const result = await fetchNews(userIdJson.token);

    if ('error' in result) {
      return NextResponse.json({ error: result.error, message: `${userIdJson.token}` }, { status: 404 });
    }

    return NextResponse.json({ news: result.news }, { status: 200 });
  } catch (error) {
    console.error('Error in POST request:', error);
    return NextResponse.json({ error: 'Server Error'}, { status: 500 });
  }
}