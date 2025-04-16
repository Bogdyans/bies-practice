import { PoolClient } from "pg";
import bcrypt from "bcryptjs";

// Тип для входящих данных
export interface NewUserData {
  login: string;
  password: string;
  role_id: number;
  fio: string;
  email?: string;
  phone_number?: string;
  job_title?: string;
  otdel_id?: number;
  location?: string;
  pseudonim?: string;
}

export async function createUser(
  client: PoolClient,
  userData: NewUserData
): Promise<number> {
  const {
    login,
    password,
    role_id,
    fio,
    email,
    phone_number,
    job_title,
    otdel_id,
    location,
    pseudonim,
  } = userData;

  // Хешируем пароль
  const hashedPassword = await bcrypt.hash(password, 10);

  // Вставка в таблицу "User"
  const userResult = await client.query(
    `
    INSERT INTO "User" (login, password_hash, role_id)
    VALUES ($1, $2, $3)
    RETURNING id
    `,
    [login, hashedPassword, role_id]
  );

  const userId = userResult.rows[0].id;

  // Вставка в таблицу "UserProfile"
  await client.query(
    `
    INSERT INTO "userprofile" (
      user_id, fio, email, phone_number,
      job_title, otdel_id, location, pseudonim
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    `,
    [
      userId,
      fio,
      email || null,
      phone_number || null,
      job_title || null,
      otdel_id || null,
      location || null,
      pseudonim || null,
    ]
  );

  return userId;
}
