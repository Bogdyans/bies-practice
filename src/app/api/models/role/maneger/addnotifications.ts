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

  async create(notification: Omit<Notification, 'id' | 'created_at' | 'is_read' | 'read_at'>): Promise<Notification> {
    try {
      const query = `
        INSERT INTO "notification" (
          user_id, title, message, notification_type,
          related_entity_type, related_entity_id
        )
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *
      `;

      const params = [
        notification.user_id,
        notification.title,
        notification.message,
        notification.notification_type,
        notification.related_entity_type || null,
        notification.related_entity_id || null
      ];

      const result = await db.query(query, params);
      return {
        ...result.rows[0],
        created_at: new Date(result.rows[0].created_at),
        read_at: result.rows[0].read_at ? new Date(result.rows[0].read_at) : null,
      };
    } catch (error) {
      console.error('Database error in create:', error);
      throw error;
    }
  },

  async updateReadStatus(id: number, is_read: boolean): Promise<Notification | null> {
    try {
      const query = `
        UPDATE "notification"
        SET 
          is_read = $1,
          read_at = CASE WHEN $1 = TRUE AND read_at IS NULL THEN CURRENT_TIMESTAMP ELSE read_at END
        WHERE id = $2
        RETURNING *
      `;
      
      const result = await db.query(query, [is_read, id]);
      
      if (result.rowCount === 0) {
        return null;
      }

      return {
        ...result.rows[0],
        created_at: new Date(result.rows[0].created_at),
        read_at: result.rows[0].read_at ? new Date(result.rows[0].read_at) : null,
      };
    } catch (error) {
      console.error('Database error in updateReadStatus:', error);
      throw error;
    }
  },

  async delete(id: number): Promise<Notification | null> {
    try {
      const query = 'DELETE FROM "notification" WHERE id = $1 RETURNING *';
      const result = await db.query(query, [id]);

      if (result.rowCount === 0) {
        return null;
      }

      return {
        ...result.rows[0],
        created_at: new Date(result.rows[0].created_at),
        read_at: result.rows[0].read_at ? new Date(result.rows[0].read_at) : null,
      };
    } catch (error) {
      console.error('Database error in delete:', error);
      throw error;
    }
  }
};