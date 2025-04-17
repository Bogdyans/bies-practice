import { NextApiRequest, NextApiResponse } from "next";
import { Pool } from "pg";
import { verifyToken } from "@/app/api/utils/jwt";

const pool = new Pool(); // или импортируй готовый экземпляр

export async function authorizeAdminOrManager(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<{ userId: number; roleId: number } | null> {
  try {
    const token = req.cookies.token;

    if (!token) {
      res.status(401).json({ message: "Не авторизован" });
      return null;
    }

    const decoded: any = verifyToken(token);
    const userId = decoded.id;

    const client = await pool.connect();
    try {
      const result = await client.query(
        `SELECT role_id FROM "User" WHERE id = $1`,
        [userId]
      );

      if (result.rows.length === 0) {
        res.status(404).json({ message: "Пользователь не найден" });
        return null;
      }

      const roleId = result.rows[0].role_id;

      if (roleId == 3) {
        res
          .status(403)
          .json({ message: "Только администратор или менеджер может выполнять это действие" });
        return null;
      }

      return { userId, roleId };
    } finally {
      client.release();
    }
  } catch (err) {
    console.error("Ошибка авторизации:", err);
    res.status(401).json({ message: "Недопустимый токен" });
    return null;
  }
}
