import { NextResponse } from 'next/server';
import {fetchUserById} from '@/app/api/controllers/profile/GetUserById';
/**
 * Обработчик POST-запросов
 * @param {Request} request - Объект запроса
 * @returns {Promise<NextResponse>} - Ответ сервера
 */
export async function POST(request: Request) {
  try {
    const userIdJson = await request.json();
    const result = await fetchUserById(userIdJson);

    if ('error' in result) {
      return NextResponse.json({ error: result.error }, { status: 404 });
    }

    return NextResponse.json({ user: result.user }, { status: 200 });
  } catch (error) {
    console.error('Error in POST request:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}