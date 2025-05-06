import pool from "@/lib/db";
import OrganizationModel from "@/models/organization";

export default class OrganizationController {
    static async getOrganizations() {
        const client = await pool.connect();

        try {
            const organizationsData = await OrganizationModel.fetchOrganizations(client);
            return organizationsData;
        } catch (error) {
            console.log(error);
            throw error;
        } finally {
            client.release();
        }
    }
}