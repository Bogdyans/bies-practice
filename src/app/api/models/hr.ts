import db from '@/app/api/controllers/connect_to_bd/conectToBd';

type Question = {
  id: number;
  status: 'pending' | 'answered';
  theme_id: number | null;
  text: string;
  user_id: number;
  created_at: Date;
};

type Answer = {
  id: number;
  question_id: number;
  text: string;
  expert_id: number;
  created_at: Date;
};

export const QuestionModel = {
  // Создание вопроса
  async create(text: string, user_id: number, theme_id?: number): Promise<Question> {
    const result = await db.query(
      `INSERT INTO questions (status, text, user_id, theme_id)
       VALUES ('pending', $1, $2, $3)
       RETURNING *`,
      [text, user_id, theme_id || null]
    );
    return result.rows[0];
  },

  // Получение вопроса по ID
  async getById(id: number): Promise<Question | null> {
    const result = await db.query(
      'SELECT * FROM questions WHERE id = $1 LIMIT 1',
      [id]
    );
    return result.rows[0] || null;
  },

  // Получение всех вопросов пользователя
  async getByUserId(user_id: number): Promise<Question[]> {
    const result = await db.query(
      'SELECT * FROM questions WHERE user_id = $1 ORDER BY created_at DESC',
      [user_id]
    );
    return result.rows;
  },

  // Обновление статуса вопроса
  async updateStatus(id: number, status: 'pending' | 'answered'): Promise<void> {
    await db.query(
      'UPDATE questions SET status = $1 WHERE id = $2',
      [status, id]
    );
  }
};

export const AnswerModel = {
  // Добавление ответа
  async create(question_id: number, text: string, expert_id: number): Promise<Answer> {
    const result = await db.query(
      `INSERT INTO answers (question_id, text, expert_id)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [question_id, text, expert_id]
    );
    return result.rows[0];
  },

  // Получение ответов на вопрос
  async getByQuestionId(question_id: number): Promise<Answer[]> {
    const result = await db.query(
      'SELECT * FROM answers WHERE question_id = $1 ORDER BY created_at',
      [question_id]
    );
    return result.rows;
  },

  // Получение ответа по ID
  async getById(id: number): Promise<Answer | null> {
    const result = await db.query(
      'SELECT * FROM answers WHERE id = $1 LIMIT 1',
      [id]
    );
    return result.rows[0] || null;
  }
};