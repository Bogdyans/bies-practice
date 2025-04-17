import { createNews, updateNews, deleteNews } from '@/app/api/models/role/maneger/addNews';
import { NextApiRequest, NextApiResponse } from 'next';
import db from "@/app/api/controllers/connect_to_bd/conectToBd";
import { verifyToken } from "@/app/api/utils/jwt"; 

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const client = await db.connect();
  try {
    const token = req.cookies?.token || req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Токен отсутствует' });

    const decoded = await verifyToken(token);
    const userId = decoded?.id;
    if (!userId) return res.status(401).json({ message: 'Неверный токен' });

    const roleResult = await client.query(`SELECT role_id FROM "User" WHERE id = $1`, [userId]);
    const roleId = roleResult.rows[0]?.role_id;
    if (!roleId) return res.status(404).json({ message: 'Пользователь не найден' });

    if (['POST', 'PUT', 'DELETE'].includes(req.method!) && roleId == 3) {
      return res.status(403).json({ message: 'Нет прав для редактирования' });
    }

    switch (req.method) {
      case 'POST': {
        const id = await createNews(client, req.body);
        return res.status(201).json({ message: 'Новость создана', id });
      }

      case 'PUT': {
        const { id, ...data } = req.body;
        const success = await updateNews(client, id, data);
        return success
          ? res.status(200).json({ message: 'Новость обновлена' })
          : res.status(404).json({ message: 'Новость не найдена' });
      }

      case 'DELETE': {
        const { id } = req.body;
        const success = await deleteNews(client, id);
        return success
          ? res.status(200).json({ message: 'Новость удалена' })
          : res.status(404).json({ message: 'Новость не найдена' });
      }

      default:
        return res.status(405).json({ message: 'Метод не поддерживается' });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Ошибка сервера' });
  } finally {
    client.release();
  }
}
