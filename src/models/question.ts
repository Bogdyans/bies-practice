import {PoolClient} from "pg";

export default class QuestionsModel {
    static async createNewQuestion(client: PoolClient ,text: string, userId: number, themeId: number){
        const query = `
                        INSERT INTO questions (status, text, user_id, theme_id)
                        VALUES ('new', $1, $2, $3);
                      `;
         const values =   [text, userId, themeId]

        try {
             await client.query(query, values);
        } catch (error) {
             throw error
        }
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