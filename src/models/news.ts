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
                        n.publish_date
                    FROM news n
                    JOIN organizations o ON n.organization_id = o.id
                    JOIN otdels ot ON o.id = ot.organization_id
                    JOIN user_profiles up ON ot.id = up.otdel_id
                    WHERE up.user_id = $1
                    ORDER BY n.publish_date DESC
                    LIMIT $2 OFFSET $3;
                  `;

    const values = [userId, limit, offset];
    const result = await client.query(query, values);

    return result.rows.length > 0 ? result.rows : null;
  }

  static async createNewNews(
    client: PoolClient,
    userId: number,
    title: string,
    text: string,
    imagesPaths: string[]
  ) {
    const newsQuery =
      // `
      //                 INSERT INTO news(title, text, author_id, organization_id, publish_date)
      //                     VALUES (
      //                         $1,
      //                         $2,
      //                         (SELECT id FROM user_profile WHERE user_id = $3),
      //                         (SELECT organization_id FROM otdels WHERE id = (SELECT otdel_id FROM users_profile WHERE user_id = $3)),
      //                         CURRENT_TIMESTAMP
      //                         RETURNING id;
      //                 `
      `
                  INSERT INTO news(title, text, author_id, organization_id, publish_date)
                  SELECT 
                  $1, 
                  $2, 
                  up.user_id,
                  o.organization_id,
                  CURRENT_TIMESTAMP
                  FROM 
                  users_profile up
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
}
