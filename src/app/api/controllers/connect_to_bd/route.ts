// app/api/check-db/route.ts
import { NextResponse } from 'next/server';
import pool from '@/app/api/controllers/connect_to_bd/conectToBd';

export async function GET() {
  const client = await pool.connect();
  try {
    // Получаем версию базы данных
    const result = await client.query('SELECT version()');

    // Возвращаем версию базы данных
    return NextResponse.json({ status: 'success', version: result.rows[0].version });
  } catch (error) {
    console.error('Database connection error:', error);
    return NextResponse.json({ status: 'error', message: 'Failed to connect to the database' }, { status: 500 });
  } finally {
    client.release();
  }
}