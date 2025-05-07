import pool from "@/lib/db";
import QuestionModel from "@/models/question";
import AnswersModel from "@/models/answers";
import QuestionsModel from "@/models/question";
import ThemesModel from "@/models/themes";
import UserModel from "@/models/user";


export default class QuestionController {
    static async createNewQuestion(text: string, userId: number, theme: string) {
        const client = await pool.connect()

        try {
            await QuestionModel.createNewQuestion(client, text, userId, theme)
        } catch (err) {
            console.error(err)
            throw err;
        }
    }

    static async createNewAnswer(questionId: number, text: string) {
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

    static async getAnswererData(userId: number, themeName: string){
        const client = await pool.connect();

        try {
            const orgId = await UserModel.getOrganizationForUser(client, userId);
            const data = await ThemesModel.getAnswererData(client, orgId, themeName);

            return data;
        } catch (error) {
            console.log("Hiii", error);
            throw error;
        } finally {
            client.release();
        }
    }
}