// src/app/api/controllers/c_main/conectToBd.ts
import { Pool } from 'pg';

// Настройка подключения к базе данных
const pool = new Pool({
  user: 'user1',
  host: 'localhost',
  database: 'promtech',
  password: '123321',
  port: 5432,
});

// Экспорт по умолчанию
export default pool;