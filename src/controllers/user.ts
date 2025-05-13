import pool from "@/lib/db";
import UserModel from "@/models/user";

export default class ProfileController {
  static async getUserOtdelById(id: number) {
    const client = await pool.connect();

    try {
      const profileData = await UserModel.findById(client, id);

      return profileData.otdel_id;
    } catch (error) {
      console.log(error);
      throw error;
    } finally {
      client.release();
    }
  }
}
