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

  static async createOrganization(client: PoolClient, name: string) {
    const insertQuery = `INSERT INTO organizations (name) VALUES ($1) RETURNING id`;
    const checkQuery = `SELECT id FROM organizations WHERE name = $1`;

    try {
      const checkResult = await client.query(checkQuery, [name]);

      if (checkResult.rows && checkResult.rows.length > 0) {
        throw new Error("Данная организация уже существует");
      }

      const result = await client.query(insertQuery, [name]);
      return result.rows[0] ?? null;
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
