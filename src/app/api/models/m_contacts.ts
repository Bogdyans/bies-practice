import { PoolClient, QueryResult } from 'pg';

interface ContactFilters {
    userId: number;
    search?: string;
    offset?: number;
    limit?: number;
    otdel_id?: number;
    location?: string;
    role_id?: number;
    sortByFio?: 'asc' | 'desc';
  }
  

export async function getContacts(
  client: PoolClient,
  filters: ContactFilters
): Promise<QueryResult> {
  const { userId, search, offset = 0, limit = 10, otdel_id, location } = filters;

  let query = `
    SELECT * FROM users 
    WHERE id != $1
  `;
  const params: any[] = [userId];
  let paramIndex = 2;

  if (search) {
    query += ` AND (fio ILIKE $${paramIndex} OR email ILIKE $${paramIndex} OR login ILIKE $${paramIndex})`;
    params.push(`%${search}%`);
    paramIndex++;
  }

  if (otdel_id) {
    query += ` AND otdel_id = $${paramIndex}`;
    params.push(otdel_id);
    paramIndex++;
  }

  if (location) {
    query += ` AND location ILIKE $${paramIndex}`;
    params.push(`%${location}%`);
    paramIndex++;
  }

  query += ` ORDER BY id DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
  params.push(limit, offset);

  return await client.query(query, params);
}
