import { Pool } from 'pg';
import db from '@/app/api/controllers/connect_to_bd/conectToBd';

export interface Notification {
  id: number;
  user_id: number;
  title: string;
  date: Date;
  status: boolean;
}

export const NotificationModel = {
  /**
   * Получить все уведомления пользователя
   * @param userId ID пользователя
   * @param limit Ограничение количества
   * @param offset Смещение
   * @param unreadOnly Только непрочитанные
   */
  async getByUserId(
    userId: number,
    limit: number = 20,
    offset: number = 0,
    unreadOnly: boolean = false
  ): Promise<Notification[]> {
    let query = `
      SELECT id, user_id, title, date, status 
      FROM notifications 
      WHERE user_id = $1
    `;
    
    const params: any[] = [userId];
    
    if (unreadOnly) {
      query += ' AND status = false';
    }
    
    query += `
      ORDER BY date DESC
      LIMIT $${params.length + 1}
      OFFSET $${params.length + 2}
    `;
    
    params.push(limit, offset);
    
    const result = await db.query(query, params);
    return result.rows;
  },

  /**
   * Создать новое уведомление
   */
  async create(
    userId: number,
    title: string,
    date: Date = new Date()
  ): Promise<Notification> {
    const result = await db.query(
      `INSERT INTO notifications (user_id, title, date, status)
       VALUES ($1, $2, $3, false)
       RETURNING *`,
      [userId, title, date]
    );
    return result.rows[0];
  },

  /**
   * Обновить статус уведомления
   */
  async updateStatus(
    id: number,
    status: boolean
  ): Promise<void> {
    await db.query(
      'UPDATE notifications SET status = $1 WHERE id = $2',
      [status, id]
    );
  }
};