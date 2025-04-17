// pages/api/admin/questions/[id]/answer.ts (или для `app` роутов: app/api/admin/questions/[id]/answer/route.ts)
import { NextApiRequest, NextApiResponse } from "next";
import { Pool } from "pg";
import { createAdminAnswer } from "@/app/api/models/role/maneger/addAnswerForUser";
import { verifyToken } from "@/app/api/utils/jwt";


const pool = new Pool(); // или импортируешь готовый экземпляр Pool

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Только POST-запросы
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Метод не разрешён" });
  }

  const { id } = req.query; // Получаем ID вопроса из URL

  if (!id || Array.isArray(id)) {
    return res.status(400).json({ error: "Неверный ID вопроса" });
  }

  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: "Не авторизован" });
  }

  try {
    // Проверка и извлечение информации о пользователе из токена
    const token = req.cookies?.token || req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Токен отсутствует' });

    const decoded = await verifyToken(token);
    const userId = decoded?.id;
    if (!userId) return res.status(401).json({ message: 'Неверный токен' });

    const roleResult = await pool.query(`SELECT role_id FROM "User" WHERE id = $1`, [userId]);
    const roleId = roleResult.rows[0]?.role_id;
    if (!roleId) return res.status(404).json({ message: 'Пользователь не найден' });
    if (roleId == 3) {
        return res.status(403).json({ message: 'Только администратор или менеджер может создовать,редачить' });
    }
    const { text } = req.body;

    if (!text || typeof text !== "string") {
      return res.status(400).json({ error: "Текст ответа обязателен" });
    }

    const client = await pool.connect();

    try {
      await client.query("BEGIN");

      const answerId = await createAdminAnswer(client, {
        questionId: parseInt(id),
        text,
        userId: userId, // мб тут будет баг с айдишниками 
      });

      await client.query("COMMIT");

      res.status(201).json({ message: "Ответ добавлен", answerId });
    } catch (error) {
      await client.query("ROLLBACK");
      console.error("Ошибка при создании ответа:", error);
      res.status(500).json({ error: "Внутренняя ошибка сервера" });
    } finally {
      client.release();
    }
  } catch (err) {
    console.error("Ошибка при верификации токена:", err);
    res.status(401).json({ message: "Недопустимый токен" });
  }
}
