import { PoolClient } from "pg";

export default class OrganizationModel {
    static async fetchOrganizations(client: PoolClient) {
        const query = `SELECT * FROM Organizations`;

        try {
            const result = await client.query(query);
            return result.rows ?? null;
        } catch (error) {
            throw error;
        }
    }
}