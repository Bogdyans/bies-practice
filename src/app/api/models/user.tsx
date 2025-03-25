// src/app/api/models/m_user.ts
import { PoolClient } from 'pg';

/**
 * Функция для получения пользователя по id
 * @param {PoolClient} client - Клиент базы данных
 * @param {number} userId - ID пользователя
 * @returns {Promise<any> | null} - Данные пользователя или null, если пользователь не найден
 */
export async function getUserById(client: PoolClient, userId: number): Promise<any | null> {
  const query = 'SELECT * FROM users WHERE id = $1';
  const values = [userId];
  const result = await client.query(query, values);

  // Если пользователь найден, возвращаем его данные
  if (result.rows.length > 0) {
    return result.rows[0];
  } else {
    return null; // Если пользователь не найден
  }
}