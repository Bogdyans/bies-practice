import {PoolClient} from "pg";

export default class ThemesModel {
    static async getAnswererData(client: PoolClient, organizationId: number, themeName: string) {
        const query = `
            SELECT
                up.fio, up.photo_url, up.job_title, up.email
            FROM user_profiles up
            JOIN answer_people ap ON up.user_id = ap.user_profile_id
            JOIN themes t ON ap.question_theme_id = t.id
            WHERE t.name = $1 AND ap.organization_id = $2;
        `;

        try {
            const result = await client.query(query, [themeName, organizationId.id]);

            return result.rows[0];
        } catch (error)  {

            throw error;
        }
    }
    static async getThemesData(client: PoolClient, orgId: number ) {
        const query = `
            SELECT 
                t.id,
                t.name,
                ap.organization_id,
                up.user_id as responsible_person_id
            FROM 
                themes t
            LEFT JOIN 
                answer_people ap ON t.id = ap.question_theme_id AND ap.organization_id = $1
            LEFT JOIN 
                user_profiles up ON ap.user_profile_id = up.user_id
            ORDER BY 
                t.name;
        `

        try {
            const result =  await client.query(query, [orgId]);
            return result.rows;
        } catch (error) {
            throw error;
        }
    }
}