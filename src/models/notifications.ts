import {PoolClient} from "pg";


export default class NotificationsModel {
  static async findAllForUser(client: PoolClient, userId: number) {
    const query = `
        SELECT id, title, message, is_read, created_at as time
        FROM notifications
        WHERE user_id = $1    
    `;
    const params = [userId];

    try {
      const result = await client.query(query, params);
      return result.rows;
    } catch (error) {
      throw error;
    }
  }

  static async createNewNotification(client: PoolClient, userId: number, title: string, message: string) {
    const query = `
        INSERT INTO notifications (
          user_id, title, message
        )
        VALUES ($1, $2, $3);
      `;

    const params = [userId, title, message];

    try {
      await client.query(query, params);
    } catch (error) {
      throw error;
    }
  }

  static async changeIsRead(client: PoolClient, id: number, newStatus: boolean) {
    const query = `
        UPDATE notifications
        SET 
          is_read = $1
        WHERE id = $2;
      `;
    const params = [newStatus, id];

    try {
      await client.query(query, params)
    } catch (error) {
      throw error;
    }
  }

  static async getUserIdOfNotification(client: PoolClient, id: number) {
    const query = `
      SELECT user_id
      FROM notifications
      WHERE id = $1;
    `
    const params = [id]

    try {
      const result = await client.query(query, params);
      return result.rows[0].user_id;
    } catch (error) {
      throw error;
    }
  }

  static async delete(client: PoolClient, id: number) {
    const query = `DELETE FROM notifications WHERE id = $1`
    const params = [id];

    try {
      await client.query(query, params)
    } catch (error) {
      throw error;
    }
  }
}