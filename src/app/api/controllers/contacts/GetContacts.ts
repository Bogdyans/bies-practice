import pool from '@/app/api/controllers/connect_to_bd/conectToBd';
import { getContacts } from '@/app/api/models/m_contacts';
import { ContactData } from './IContacts';

export async function fetchContacts({
  userId,
  search,
  offset,
  limit,
  otdel_id,
  location,
  role_id,
  sortByFio,
}: {
  userId: number;
  search?: string;
  offset?: number;
  limit?: number;
  otdel_id?: number;
  location?: string;
  role_id?: number;
  sortByFio?: 'asc' | 'desc';
}): Promise<{ contacts: ContactData[] } | { error: string }> {
  const client = await pool.connect();

  try {
    const result = await getContacts(client, {
      userId,
      search,
      offset,
      limit,
      otdel_id,
      location,
      role_id,
      sortByFio,
    });

    const contacts: ContactData[] = result.rows.map(row => ({
      id: row.id,
      fio: row.fio,
      phone_number: row.phone_number,
      email: row.email,
      office: row.office,
      otdel_id: row.otdel_id,
      location: row.location,
      Username: row.Username,
      login: row.login,
      role_id: row.role_id,
    }));

    return { contacts };
  } catch (error) {
    console.error('Error fetching contacts:', error);
    return { error: 'Failed to fetch contacts' };
  } finally {
    client.release();
  }
}




  