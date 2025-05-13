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

  static async createDepartment(
    client: PoolClient,
    name: string,
    organizationId: number
  ) {
    const insertQuery = `INSERT INTO otdels (name, organization_id) VALUES ($1, $2) RETURNING id`;
    const checkQuery = `SELECT * FROM otdels WHERE name = $1 AND organization_id = $2`;

    try {
      const checkResult = await client.query(checkQuery, [
        name,
        organizationId,
      ]);

      if (checkResult.rows && checkResult.rows.length > 0) {
        throw new Error("Данная организация уже существует");
      }

      const result = await client.query(insertQuery, [name, organizationId]);
      return result.rows[0] ?? null;
    } catch (error) {
      throw error;
    }
  }
}
