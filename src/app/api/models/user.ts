// src/app/api/models/m_user.ts
import { PoolClient, QueryResult, QueryResultRow } from "pg";

export interface User {
  id: number,
  fio: string,
  phone_number: string,
  email: string,
  doljnost: string,
  otdel_id: number,
  location: string,
  pseudonim: string,
  login: string,
  password: string,
  role_id: number,
}

/**
 * Функция для получения пользователя по id
 * @param {PoolClient} client - Клиент базы данных
 * @param {number} userId - ID пользователя
 * @returns {Promise<any> | null} - Данные пользователя или null, если пользователь не найден
 */
export async function getUserById(
  client: PoolClient,
  userId: number
): Promise<User | null> {
  const query : string = "SELECT * FROM users WHERE id = $1";
  const result = await client.query(query, [userId]);
  return result.rows[0] ?? null;
}

export async function getUserInfoByUsername(
  client: PoolClient,
  username: string
): Promise<User | null> {
  const query : string = "SELECT * FROM users WHERE login = $1";
  const result = await client.query(query, [username]);
  return result.rows[0] ?? null;
}
