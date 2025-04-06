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
  async getByUserId(
    userId: number,
    limit: number = 20,
    offset: number = 0,
    unreadOnly: boolean = false
  ): Promise<Notification[]> {
    try {
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
      return result.rows.map(row => ({
        ...row,
        date: new Date(row.date)
      }));
    } catch (error) {
      console.error('Database error in getByUserId:', error);
      throw error;
    }
  },

  // ... остальные методы без изменений
};