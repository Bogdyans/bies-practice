import { PoolClient } from "pg";

interface getInterface {
    user_id: number;
    search_str?: string;
    limit: number;
    offset: number;
}

export default class ContactsModel {
    static async get(params: getInterface, client: PoolClient) {
        const { user_id, search_str, limit, offset } = params;

        let query = `
            SELECT 
                u.id,
                up.fio
            FROM "user" u
            JOIN "userprofile" up ON u.id = up.user_id
            WHERE u.id != $1
        `;

        // массив значений параметров
        const values: any[] = [user_id];
        let paramIndex = 2;

        if (search_str) {
            query += `
                AND (
                    up.fio ILIKE $${paramIndex} OR
                    up.email ILIKE $${paramIndex} OR
                    u.login ILIKE $${paramIndex}
                )
            `;
            values.push(`%${search_str}%`);
            paramIndex++;
        }

        query += ` ORDER BY up.fio LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
        values.push(limit, offset);
        const result = await client.query(query, values);

        return result.rows;
    }
}