import { PoolClient } from "pg";
import bcrypt from "bcryptjs";

export interface NewUserData {
  login: string;
  password: string;
  role_id: number;
  fio: string;
  email: string;
  phone_number: string;
  job_title: string;
  otdel_id: number;
  location: string;
  pseudonim?: string;
  avatar?: File;
}

export default class UserModel {
  static async findById(client: PoolClient, userId: number) {
    const query = `
                    SELECT 
                        u.id, u.login, u.role_id, u.created_at,
                        up.fio, up.email, up.phone_number, up.job_title, up.otdel_id, up.location, up.pseudonim
                    FROM users u
                    LEFT JOIN user_profiles up ON u.id = up.user_id
                    WHERE u.id = $1
                  `;

    try {
        const result = await client.query(query, [userId]);
        return result.rows[0] ?? null;
    } catch (error) {
        throw error;
    }
  }

    static async findByIdProfile(client: PoolClient, userId: number) {
        const query = `
                    SELECT 
                        u.id,
                        up.fio, up.email, up.phone_number, up.job_title, up.location, up.pseudonim, up.photo_url,
                        ot.name as otdel,
                        o.name as organization
                    FROM users u
                    LEFT JOIN user_profiles up ON u.id = up.user_id
                    LEFT JOIN otdels ot ON ot.id = up.otdel_id
                    LEFT JOIN organizations o ON o.id = ot.organization_id 
                    WHERE u.id = $1
                  `;

        try {
            const result = await client.query(query, [userId]);
            return result.rows[0] ?? null;
        } catch (error) {
            throw error;
        }
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

    try {
        const result = await client.query(query, [username]);
        return result.rows[0] ?? null;
    } catch (error) {
        throw error;
    }
  }

  static async createUserWithProfile(client: PoolClient, data: NewUserData & { photoUrl?: string }) {
    try {
      const hashedPassword = await bcrypt.hash(data.password, 10);

      const userResult = await client.query(
          `
            INSERT INTO users (login, password_hash, role_id)
            VALUES ($1, $2, $3)
            RETURNING id
        `,
          [data.login, hashedPassword, data.role_id]
      );
      const userId = userResult.rows[0].id;

      await client.query(
          `
            INSERT INTO user_profiles (
                user_id, fio, email, phone_number, job_title, otdel_id, location, pseudonim, photo_url
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        `,
          [
            userId,
            data.fio,
            data.email,
            data.phone_number,
            data.job_title,
            data.otdel_id,
            data.location,
            data.pseudonim || null,
            data.photoUrl || null
          ]
      );

      return userId;
    } catch (err) {
      throw err;
    }
  }
}

