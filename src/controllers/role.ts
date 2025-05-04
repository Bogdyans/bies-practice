import pool from "@/lib/db";
import RoleModel from "@/models/role";

export default class RoleController {
    static async getRoles() {
        const client = await pool.connect();

        try {
            const rolesData = await RoleModel.fetchRoles(client);
            return rolesData;
        } catch (error) {
            console.log(error);
            throw error;
        } finally {
            client.release();
        }
    }
}