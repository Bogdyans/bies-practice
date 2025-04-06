import pool from '@/app/api/controllers/connect_to_bd/conectToBd';
import { getUserById } from '@/app/api/models/user';
import { UserIdRequest, UserData } from '@/app/api/controllers/profile/IUserIdjson';

/**
 * Функция для получения пользователя по id
 * @param {UserIdRequest} userIdRequest - JSON-объект вида { "id": 1 }
 * @returns {Promise<{ user: UserData } | { error: string }>} - Данные пользователя или ошибка
 */


export async function fetchUserById(userIdRequest: UserIdRequest): Promise<{ user: UserData } | { error: string }> {
  const client = await pool.connect();
  try {
    const userId = userIdRequest.id;
    const user = await getUserById(client, userId) as  UserData;
    if (!user) {
      return { error: 'User not found' };
    }
    return { user };
  } catch (error) {
    console.error('Database query error:', error);
    return { error: 'Internal Server Error' };
  } finally {
    client.release();
  }
}