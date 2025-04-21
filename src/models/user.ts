import { PoolClient } from "pg";



export default class UserModel {
  static async findById(client: PoolClient, userId: number) {
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

  static async findByUsername(client: PoolClient, username: string) {
    const query = `
                      SELECT 
                        u.id,
                        u.login,
                        u.password_hash  
                      FROM users u
                      WHERE u.login = $1
                  `;

    const result = await client.query(query, [username]);
    //console.log(result)
    return result.rows[0] ?? null;
  }
}

