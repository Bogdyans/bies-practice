import {PoolClient} from "pg";

export default class QuestionsModel {
    static async createNewQuestion(client: PoolClient ,text: string, userId: number, theme: string){
        const data = await client.query(`SELECT id FROM themes WHERE name = $1`, [theme]);
        if (!data.rows[0]) throw new Error(`Theme not found`);

        const query = `
                        INSERT INTO questions (status, text, user_id, theme_id)
                        VALUES ('new', $1, $2, $3);
                      `;
         const values =   [text, userId, data.rows[0].id]

        try {
             await client.query(query, values);
        } catch (error) {
             throw error
        }
    }

    static async getById(client: PoolClient, id: number) {
        const query = 'SELECT * FROM "question" WHERE id = $1'
        const values = [id];

        const result = await client.query(query, values);
        return result.rows[0] || null;
    }


    static async changeStatusForQuestion(client: PoolClient, questionId: number, status: string){
        const query = 'UPDATE questions SET status = $1 WHERE id = $2'
        const values = [status, questionId]

        try {
            await client.query(query, values);
        } catch (error) {
            throw error
        }
    }
}