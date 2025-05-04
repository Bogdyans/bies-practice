import { PoolClient } from "pg";

export default class RoleModel {
    static async fetchRoles(client: PoolClient) {
        const query = `SELECT * FROM Roles`;

        try {
            const result = await client.query(query);
            return result.rows ?? null;
        } catch (error) {
            throw error;
        }
    }
}