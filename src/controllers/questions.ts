import pool from "@/lib/db";
import QuestionModel from "@/models/question";
import AnswersModel from "@/models/answers";
import QuestionsModel from "@/models/question";
import ThemesModel from "@/models/themes";
import UserModel from "@/models/user";
import {AnswerersModel} from "@/models/answerers";
import NotificationsModel from "@/models/notifications";


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
            const questionDataForNotification = await QuestionModel.getUserId(client, questionId)
            console.log(questionDataForNotification)
            await NotificationsModel.createNewNotification(client, questionDataForNotification.user_id, `Вы получил ответ на ваш вопрос`, `${questionDataForNotification.text}: ${text}`)

            await client.query("COMMIT");
        } catch (error) {
            await client.query("ROLLBACK");
            console.error(error);
            throw error;
        } finally {
            client.release();
        }
    }

    static async getAnswererData(userId: number, themeName: string) {
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

    static async getQuestions(userId: number, orgId: number, status: string) {
        const client = await pool.connect();

        try {
            let questions;
            const profileData = await UserModel.findById(client, userId);

            if (profileData.role_id == 1) {
                questions = await QuestionsModel.findByStatusAndOrganization(client, status, orgId)
            } else {
                const themes = await AnswerersModel.getResponsobilitiesForUser(client, userId);
                const themesN = themes.map((theme) => parseInt(theme.question_theme_id, 10));
                questions = await QuestionsModel.findByThemesAnsStatus(client, themesN, orgId, status);
            }
            return questions;
        } catch (error) {
            console.log(error);
            throw error;
        } finally {
            client.release()
        }
    }
}

