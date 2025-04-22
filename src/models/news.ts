import { PoolClient } from 'pg';


export default class NewsModel {
  static async getNews(client: PoolClient, userId: number, limit: number, offset: number) {
    const query = `
                    SELECT 
                        n.id AS news_id,
                        n.title,
                        n.text,
                        n.publish_date
                    FROM news n
                    JOIN organizations o ON n.organization_id = o.id
                    JOIN otdels ot ON o.id = ot.organization_id
                    JOIN user_profiles up ON ot.id = up.otdel_id
                    WHERE up.user_id = $1
                    ORDER BY n.publish_date DESC
                    LIMIT $2 OFFSET $3;
                  `

    const values = [userId, limit, offset];
    const result = await client.query(query, values);

    return result.rows.length > 0 ? result.rows : null;
  }
}
