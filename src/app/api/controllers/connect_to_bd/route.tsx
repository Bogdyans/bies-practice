import { getUserById } from '@/app/api/models/m_user';
import { NextResponse } from 'next/server';
import pool from '@/app/api/controllers/connect_to_bd/conectToBd';

interface UserIdJson {
  userId: string;
}
/**
 * Функция для получения пользователя по id
 * @param {UserIdJson} userIdJson - JSON-объект вида { "userId": "1" }
 * @returns {Promise<{ user: any } | { error: string }>} - Данные пользователя или ошибка
 */
export async function fetchUserById(userIdJson: UserIdJson): Promise<{ user: any } | { error: string }> {
  const client = await pool.connect();
  try {
    const userId = parseInt(userIdJson.userId, 10);

    // Проверяем, что userId является валидным числом
    if (isNaN(userId)) {
      return { error: 'Invalid user ID' };
    }

    // Получаем данные пользователя
    const user = await getUserById(client, userId);

    // Если пользователь не найден, возвращаем ошибку
    if (!user) {
      return { error: 'User not found' };
    }

    // Если пользователь найден, возвращаем его данные
    return { user };
  } catch (error) {
    console.error('Database query error:', error);
    return { error: 'Internal Server Error' };
  } finally {
    client.release();
  }
}

/**
 * Обработчик POST-запросов
 * @param {Request} request - Объект запроса
 * @returns {Promise<NextResponse>} - Ответ сервера
 */
export async function POST(request: Request) {
  try {
    const userIdJson = await request.json();
    const result = await fetchUserById(userIdJson);

    // Если есть ошибка, возвращаем её
    if ('error' in result) {
      return NextResponse.json({ error: result.error }, { status: 404 });
    }

    // Если пользователь найден, возвращаем его данные
    return NextResponse.json({ user: result.user }, { status: 200 });
  } catch (error) {
    console.error('Error in POST request:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}