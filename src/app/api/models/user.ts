// src/app/api/models/m_user.ts
import { PoolClient, QueryResult, QueryResultRow } from "pg";

/**
 * Функция для получения пользователя по id
 * @param {PoolClient} client - Клиент базы данных
 * @param {number} userId - ID пользователя
 * @returns {Promise<any> | null} - Данные пользователя или null, если пользователь не найден
 */
export async function getUserById(
  client: PoolClient,
  userId: number
): Promise<QueryResultRow | null> {
  const query : string = "SELECT * FROM users WHERE id = $1";
  const result : QueryResult<QueryResultRow> = await client.query(query, [userId]);
  console.log(result)
  return result.rows[0] ?? null;
}

export async function getUserInfoByUsername(
  client: PoolClient,
  username: string
): Promise<QueryResultRow | null> {
  const query : string = "SELECT * FROM users WHERE login = $1";
  const result : QueryResult<QueryResultRow> = await client.query(query, [username]);
  console.log(result)
  return result.rows[0] ?? null;
}
