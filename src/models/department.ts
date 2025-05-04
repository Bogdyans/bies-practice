import { PoolClient } from "pg";

export default class DepartmentModel {
    static async fetchDepartmentsByOrgId(client: PoolClient, orgId: number) {
        const query = `SELECT * FROM Otdels WHERE organization_id = $1`;

        try {
            const result = await client.query(query, [orgId]);
            return result.rows ?? null;
        } catch (error) {
            throw error;
        }
    }
}