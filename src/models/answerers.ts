import {PoolClient} from "pg";


export class AnswerersModel{
    static async setAnswerer(client: PoolClient, orgId: number, themeId: number, userId: number) {
        const query = `
            INSERT INTO answer_people (question_theme_id, organization_id, user_profile_id)
            VALUES ($1, $2, $3);
        `

        const values = [themeId, orgId, userId];

        try {
            await client.query(query, values);
        } catch (error) {
            throw error;
        }
    }

    static async deleteAnswerer(client: PoolClient, orgId: number, themeId: number) {
        const query = `
            DELETE FROM answer_people
            WHERE question_theme_id = $2 AND organization_id = $1;
        `

        const values = [themeId, orgId];

        try {
            await client.query(query, values);
        } catch (error) {
            throw error;
        }
    }
}