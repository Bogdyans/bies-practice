import pool from "@/lib/db";
import ThemesModel from "@/models/themes";


export class ThemesController {
    static async getThemesWithAnswerers(orgId: number) {
        const client = await pool.connect();

        try {
            const themesData = await ThemesModel.getThemesData(client, orgId);
            return themesData;
        } catch (error) {
            console.log(error);
            throw error;
        } finally {
            client.release();
        }
    }
}