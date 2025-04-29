import pool from "@/lib/db";
import QuestionModel from "@/models/question";
import AnswersModel from "@/models/answers";
import QuestionsModel from "@/models/question";


export default class QuestionController {
    static async createNewQuestion(text: string, userId: number, themeId: number) {
        const client = await pool.connect()

        try {
            await QuestionModel.createNewQuestion(client, text, userId, themeId)
        } catch (err) {
            console.error(err)
            throw err;
        }
    }

    static async createNewAnswer(questionId: number,text: string) {
        const client = await pool.connect()

        try {
            await client.query('BEGIN')

            await AnswersModel.createNewAnswer(client, text, questionId)
            await QuestionsModel.changeStatusForQuestion(client, questionId, 'answered')

            await client.query("COMMIT");
        } catch (error) {
            await client.query("ROLLBACK");
            console.error(error);
            throw error;
        } finally {
            client.release();
        }
    }
}