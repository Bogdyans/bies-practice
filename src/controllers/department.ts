import pool from "@/lib/db";
import DepartmentModel from "@/models/department";

export default class DepartmentController {
    static async getDepartmentsByOrgId(orgId : number) {
        const client = await pool.connect();

        try {
            const departmentsData = await DepartmentModel.fetchDepartmentsByOrgId(client, orgId);
            return departmentsData;
        } catch (error) {
            console.log(error);
            throw error;
        } finally {
            client.release();
        }
    }
}