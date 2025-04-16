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
      `INSERT INTO "question" (status, text, user_id, theme_id)
       VALUES ('new', $1, $2, $3)
       RETURNING *`,
      [text, user_id, theme_id || null]
    );
    return result.rows[0];
  },

  // Получение вопроса по ID
  async getById(id: number): Promise<Question | null> {
    const result = await db.query(
      'SELECT * FROM "question" WHERE id = $1 LIMIT 1',
      [id]
    );
    return result.rows[0] || null;
  },

  // Получение всех вопросов пользователя
  async getByUserId(user_id: number): Promise<Question[]> {
    const result = await db.query(
      'SELECT * FROM "question" WHERE user_id = $1 ORDER BY created_at DESC',
      [user_id]
    );
    return result.rows;
  },

  // Обновление статуса вопроса
  async updateStatus(id: number, status: 'new' | 'answered'): Promise<void> {
    await db.query(
      'UPDATE "question" SET status = $1 WHERE id = $2',
      [status, id]
    );
  },

  // Установка официального ответа на вопрос
  async setOfficialAnswer(question_id: number, answer_id: number): Promise<void> {
    await db.query(
      'UPDATE "question" SET answer_id = $1, status = $2 WHERE id = $3',
      [answer_id, 'answered', question_id]
    );
  }
};

export const AnswerModel = {
  // Добавление ответа
  async create(question_id: number, text: string, user_id: number, is_official = false): Promise<Answer> {
    const result = await db.query(
      `INSERT INTO "answer" (question_id, text, user_id, is_official)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [question_id, text, user_id, is_official]
    );
    return result.rows[0];
  },

  // Получение всех ответов на вопрос
  async getByQuestionId(question_id: number): Promise<Answer[]> {
    const result = await db.query(
      'SELECT * FROM "answer" WHERE question_id = $1 ORDER BY created_at',
      [question_id]
    );
    return result.rows;
  },

  // Получение ответа по ID
  async getById(id: number): Promise<Answer | null> {
    const result = await db.query(
      'SELECT * FROM "answer" WHERE id = $1 LIMIT 1',
      [id]
    );
    return result.rows[0] || null;
  },

  // Обновление текста ответа
  async updateText(id: number, newText: string): Promise<void> {
    await db.query(
      `UPDATE "answer" SET text = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2`,
      [newText, id]
    );
  }
};