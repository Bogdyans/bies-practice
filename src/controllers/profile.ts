import pool from "@/lib/db";
import UserModel from "@/models/user";
import {AnswerersModel} from "@/models/answerers";


export default class ProfileController {
    static async getProfileById(id: number) {
        const client = await pool.connect();

        try {
            const profileData = await UserModel.findByIdProfile(client, id)

            return profileData;
        } catch (error) {
            console.log(error);
            throw error;
        } finally {
            client.release();
        }
    }

    static async getUserRoleById(id: number) {
        const client = await pool.connect();

        try {
            const profileData = await UserModel.findById(client, id);
            const isResponsible = await AnswerersModel.isResponsible(client, id);

            return { role: profileData.role_id, isResponsible: isResponsible };
        } catch (error) {
            console.log(error);
            throw(error);
        } finally {
            client.release();
        }
    }
}