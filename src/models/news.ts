import { PoolClient } from "pg";

export default class NewsModel {
  static async getNews(
    client: PoolClient,
    userId: number,
    limit: number,
    offset: number
  ) {
    const query = `
                    SELECT 
                        n.id AS news_id,
                        n.title,
                        n.text,
                        n.publish_date as date,
                        COALESCE(
                            (
                                SELECT json_agg(json_build_object(
                                    'url', np.image_path,
                                    'caption', np.caption
                                ))
                                FROM news_photos np
                                WHERE np.news_id = n.id
                            ), '[]'::json
                        ) AS photos
                    FROM news n
                    JOIN organizations o ON n.organization_id = o.id
                    JOIN otdels ot ON o.id = ot.organization_id
                    JOIN user_profiles up ON ot.id = up.otdel_id
                    WHERE up.user_id = $1
                    ORDER BY n.publish_date, n.id DESC
                    LIMIT $2 OFFSET $3;
                  `;

    const values = [userId, limit, offset];
    const result = await client.query(query, values);

    return result.rows.length > 0 ? result.rows : null;
  }

  static async findNewsById(client: PoolClient, id: number) {
    const query = `
      SELECT 
        n.id AS news_id,
        n.title,
        n.text,
        n.publish_date as date,
        n.organization_id,
        COALESCE(
            (
                SELECT json_agg(json_build_object(
                    'url', np.image_path,
                    'caption', np.caption
                ))
                FROM news_photos np
                WHERE np.news_id = n.id
            ), '[]'::json
        ) AS photos
      FROM news n
      WHERE n.id = $1;
    `
    try {
      const newsData = await client.query(query, [id]);

      console.log(newsData.rows);
      return newsData.rows.length > 0 ? newsData.rows[0] : null;
    } catch (error) {
      throw error;
    }
  }

  static async createNewNews(
    client: PoolClient,
    userId: number,
    title: string,
    text: string,
    imagesPaths: string[]
  ) {
    const newsQuery = `
                  INSERT INTO news(title, text, author_id, organization_id, publish_date)
                  SELECT 
                  $1, 
                  $2, 
                  up.user_id,
                  o.organization_id,
                  CURRENT_TIMESTAMP
                  FROM 
                  user_profiles up
                  JOIN 
                  otdels o ON o.id = up.otdel_id
                  WHERE 
                  up.user_id = $3
                  RETURNING id;
                    `;
    const values = [title, text, userId];

    try {
      const result = await client.query(newsQuery, values);
      const newsId = result.rows[0].id;

      for (const path of imagesPaths) {
        await client.query(
          "INSERT INTO news_photos (news_id, image_path, caption) VALUES ($1, $2, $3)",
          [newsId, path, path]
        );
      }
    } catch (error) {
      throw error;
    }
  }

  static async getNewsCountForOrganization(client: PoolClient, userId: number,) {
    const query = `
      SELECT COUNT(*) as total
      FROM news n
      JOIN organizations o ON n.organization_id = o.id
      JOIN otdels ot ON o.id = ot.organization_id
      JOIN user_profiles up ON ot.id = up.otdel_id
      WHERE up.user_id = $1;
    `
    try {
      const result = await client.query(query, [userId])

      return result.rows.length > 0 ? result.rows[0] : 0;
    } catch (error) {
      throw error;
    }
  }
}
