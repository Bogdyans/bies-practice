import db from '@/app/api/controllers/connect_to_bd/conectToBd';

export interface Notification {
  id: number;
  user_id: number;
  title: string;
  message: string;
  notification_type: string;
  is_read: boolean;
  created_at: Date;
  read_at?: Date | null;
  related_entity_type?: string | null;
  related_entity_id?: number | null;
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
        SELECT 
          id, user_id, title, message, notification_type,
          is_read, created_at, read_at,
          related_entity_type, related_entity_id
        FROM "notification"
        WHERE user_id = $1
      `;

      const params: any[] = [userId];

      if (unreadOnly) {
        query += ' AND is_read = FALSE';
      }

      query += `
        ORDER BY created_at DESC
        LIMIT $${params.length + 1}
        OFFSET $${params.length + 2}
      `;

      params.push(limit, offset);

      const result = await db.query(query, params);
      return result.rows.map(row => ({
        ...row,
        created_at: new Date(row.created_at),
        read_at: row.read_at ? new Date(row.read_at) : null,
      }));
    } catch (error) {
      console.error('Database error in getByUserId:', error);
      throw error;
    }
  },
};
