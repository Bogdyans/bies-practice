import pool from "@/lib/db";
import UserModel from "@/models/user";


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
}