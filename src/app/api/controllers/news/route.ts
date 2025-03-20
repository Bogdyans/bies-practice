// app/api/controllers/news/route.ts
import { NextResponse } from 'next/server';
import { fetchNews } from '@/app/api/controllers/news/getNews';

export async function POST(request: Request) {
  try { //ффф
    const userIdJson = await request.json();
    const result = await fetchNews(userIdJson.token); 

    if ('error' in result) {
      return NextResponse.json({ error: result.error, message: `${userIdJson.id}` }, { status: 404 });
    }

    return NextResponse.json({ news: result.news }, { status: 200 });
  } catch (error) {
    console.error('Error in POST request:', error);
    return NextResponse.json({ error: 'Server Error'}, { status: 500 });
  }
}