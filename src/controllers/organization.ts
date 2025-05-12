import pool from "@/lib/db";
import OrganizationModel from "@/models/organization";

export default class OrganizationController {
  static async getOrganizations() {
    const client = await pool.connect();

    try {
      const organizationsData = await OrganizationModel.fetchOrganizations(
        client
      );
      return organizationsData;
    } catch (error) {
      console.log(error);
      throw error;
    } finally {
      client.release();
    }
  }

  static async createOrganization(name: string) {
    const client = await pool.connect();

    try {
      const organizationData = await OrganizationModel.createOrganization(
        client,
        name
      );
      return organizationData;
    } catch (error) {
      console.log(error);
      throw error;
    } finally {
      client.release();
    }
  }

    static async findAllUsers(organizationId: number) {
        const client = await pool.connect();

        try {
            const users = await OrganizationModel.findAllUsers(client, organizationId);
            return users;
        } catch (error) {
            console.log(error);
            throw error;
        } finally {
            client.release();
        }
    }
}
