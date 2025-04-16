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
  const {
    userId,
    search,
    offset = 0,
    limit = 10,
    otdel_id,
    location,
    role_id,
    sortByFio = 'asc',
  } = filters;

  let query = `
    SELECT 
      u.id,
      u.login,
      u.role_id,
      up.fio,
      up.email,
      up.phone_number,
      up.job_title,
      up.location,
      up.otdel_id
    FROM "User" u
    JOIN "userprofile" up ON u.id = up.user_id
    WHERE u.id != $1
  `;

  const params: any[] = [userId];
  let paramIndex = 2;

  if (search) {
    query += ` AND (up.fio ILIKE $${paramIndex} OR up.email ILIKE $${paramIndex} OR u.login ILIKE $${paramIndex})`;
    params.push(`%${search}%`);
    paramIndex++;
  }

  if (otdel_id) {
    query += ` AND up.otdel_id = $${paramIndex}`;
    params.push(otdel_id);
    paramIndex++;
  }

  if (location) {
    query += ` AND up.location ILIKE $${paramIndex}`;
    params.push(`%${location}%`);
    paramIndex++;
  }

  if (role_id) {
    query += ` AND u.role_id = $${paramIndex}`;
    params.push(role_id);
    paramIndex++;
  }

  query += ` ORDER BY up.fio ${sortByFio === 'desc' ? 'DESC' : 'ASC'} LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
  params.push(limit, offset);

  return await client.query(query, params);
}
