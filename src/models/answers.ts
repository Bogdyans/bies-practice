import {PoolClient} from "pg";


export default class AnswersModel {
    static async createNewAnswer(client: PoolClient, text: string, questionId: number) {
        const query = `
                        INSERT INTO answers (question_id, text)
                        VALUES ($1, $2)
                        RETURNING *
                      `
        const values = [questionId, text]

        try {
            await client.query(query, values);
        } catch (err) {
            throw err;
        }
    }

    static async getById(client: PoolClient, id: number) {
        const query = `SELECT * FROM answers WHERE id = $1`;
        const values = [id];

        const result = await client.query(query, values);
        return result.rows[0] || null;
    }
}