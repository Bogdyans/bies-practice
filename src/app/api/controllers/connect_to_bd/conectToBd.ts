// src/app/api/controllers/c_main/conectToBd.ts
import { Pool } from 'pg';

// Настройка подключения к базе данных
const pool = new Pool({
  user: 'your_username',
  host: 'your_host',
  database: 'your_database',
  password: 'your_password',
  port: 5432,
});

// Экспорт по умолчанию
export default pool;