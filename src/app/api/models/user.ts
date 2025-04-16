import { PoolClient, QueryResultRow } from "pg";

/**
 * Получение пользователя по ID
 */
export async function getUserById(
  client: PoolClient,
  userId: number
): Promise<QueryResultRow | null> {
  const query = `
    SELECT 
      u.id, u.login, u.role_id, u.created_at, u.last_login_at, u.is_active,
      up.fio, up.email, up.phone_number, up.job_title, up.otdel_id, up.location, up.pseudonim
    FROM "User" u
    LEFT JOIN "userprofile" up ON u.id = up.user_id
    WHERE u.id = $1
  `;
  const result = await client.query(query, [userId]);
  return result.rows[0] ?? null;
}

/**
 * Получение пользователя по логину (username)
 */
export async function getUserInfoByUsername(
  client: PoolClient,
  username: string
): Promise<QueryResultRow | null> {
  const query = `
    SELECT 
      u.id,
      u.login,
      u.password_hash  
    FROM "User" u
    WHERE u.login = $1
  `;
  
  const result = await client.query(query, [username]);
  //console.log(result)
  return result.rows[0] ?? null;
}
