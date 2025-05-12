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

    static async findAllUsers(client: PoolClient, orgId: number) {
        const query = `
            SELECT
                up.user_id as id,
                up.fio as name,
                up.location as position,
                up.email,
                up.photo_url
            FROM user_profiles up 
            JOIN otdels o on o.id = up.otdel_id
            WHERE o.organization_id = $1;
        `

        try {
            const result = await client.query(query, [orgId]);
            return result.rows ?? null;
        } catch (error) {
            throw error;
        }
    }
}