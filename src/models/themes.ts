import {PoolClient} from "pg";
import {error} from "next/dist/build/output/log";


export default class ThemesModel {
    static async getAnswererData(client: PoolClient, userId: number, themeName: string) {
        const query = `
            SELECT
                up.fio, up.photo_url, up.job_title, up.email
            FROM user_profiles up
            JOIN answer_people ap ON up.user_id = ap.user_profile_id
            JOIN themes t ON ap.question_theme_id = t.id
            WHERE t.name = $1 AND up.user_id = $2;
        `;

        try {
            const result = await client.query(query, [themeName, userId]);
            return result.rows[0];
        } catch  {
            throw error;
        }
    }
}