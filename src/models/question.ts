import {PoolClient} from "pg";

export default class QuestionsModel {
    static async createNewQuestion(client: PoolClient ,text: string, userId: number, theme: string){
        const data = await client.query(`SELECT id FROM themes WHERE name = $1`, [theme]);
        if (!data.rows[0]) throw new Error(`Theme not found`);

        const query = `
                        INSERT INTO questions (status, text, user_id, theme_id)
                        VALUES ('new', $1, $2, $3);
                      `;
         const values =   [text, userId, data.rows[0].id]

        try {
             await client.query(query, values);
        } catch (error) {
             throw error
        }
    }

    static async getById(client: PoolClient, id: number) {
        const query = 'SELECT * FROM "question" WHERE id = $1'
        const values = [id];

        const result = await client.query(query, values);
        return result.rows[0] || null;
    }


    static async changeStatusForQuestion(client: PoolClient, questionId: number, status: string){
        const query = 'UPDATE questions SET status = $1 WHERE id = $2'
        const values = [status, questionId]

        try {
            await client.query(query, values);
        } catch (error) {
            throw error
        }
    }

    static async findByStatusAndOrganization(client: PoolClient, status: string, orgId: number) {
        let query = `
        SELECT q.*
        FROM questions q
        JOIN user_profiles u ON q.user_id = u.user_id
        JOIN otdels o ON u.otdel_id = o.id
    `;

        const conditions: string[] = [];
        const values: any[] = [];

        if (status !== 'all') {
            values.push(status);
            conditions.push(`q.status = $${values.length}`);
        }

        if (orgId !== 0) {
            values.push(orgId);
            conditions.push(`o.organization_id = $${values.length}`);
        }

        if (conditions.length > 0) {
            query += ` WHERE ` + conditions.join(' AND ');
        }
        try {
            const result = await client.query(query, values);
            return result.rows;
        } catch (error) {
            console.log(error)
            throw error
        }
    }

    static async findByThemesAnsStatus(client: PoolClient, themes: number[], orgId: number, status: string) {
        let query = `
        SELECT q.*
        FROM questions q
        JOIN user_profiles u ON q.user_id = u.user_id
        JOIN otdels o ON u.otdel_id = o.id
    `;

        const conditions: string[] = [];
        const values: any[] = [];

        // Фильтр по статусу
        if (status !== 'all') {
            values.push(status);
            conditions.push(`q.status = $${values.length}`);
        }

        // Фильтр по организации
        if (orgId !== 0) {
            values.push(orgId);
            conditions.push(`o.organization_id = $${values.length}`);
        }

        // Фильтр по темам
        if (themes.length > 0) {
            values.push(themes);
            conditions.push(`q.theme_id = ANY($${values.length})`);
        }

        if (conditions.length > 0) {
            query += ` WHERE ` + conditions.join(' AND ');
        }

        const result = await client.query(query, values);
        return result.rows;
    }
}