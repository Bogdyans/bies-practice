import pool from '@/lib/db';

export default  class StatusController {
    static async getDBStatus() {
        const client = await pool.connect();

        try {
            const result = await client.query('SELECT version()');

            return result.rows[0].version;
        } catch (error) {
            console.error('Database connection error:', error);
            throw error;
        } finally {
            client.release();
        }
    }
}