import { PoolClient } from 'pg';


export interface NewAnswerData {
    questionId: number;
    text: string;
    userId: number; // ID админа
  }
  
  export async function createAdminAnswer(
    client: PoolClient,
    answerData: NewAnswerData
  ): Promise<number> {
    const { questionId, text, userId } = answerData;
  
    const answerResult = await client.query(
      `
      INSERT INTO "Answer" (question_id, text, user_id, is_official)
      VALUES ($1, $2, $3, TRUE)
      RETURNING id
      `,
      [questionId, text, userId]
    );
  
    await client.query(
      `
      UPDATE "Question"
      SET status = 'answered', updated_at = NOW()
      WHERE id = $1
      `,
      [questionId]
    );
  
    return answerResult.rows[0].id;
  }
  