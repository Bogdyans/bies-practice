import { NextRequest, NextResponse } from 'next/server';
import { QuestionModel, AnswerModel } from '../../models/hr';;

// Типы для запросов
type CreateQuestionRequest = {
  text: string;
  user_id: number;
  theme_id?: number;
};

type CreateAnswerRequest = {
  question_id: number;
  text: string;
  expert_id: number;
};

// GET /api/hr/questions - Получить все вопросы
export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get('user_id');
    
    if (userId) {
      // Получаем вопросы конкретного пользователя
      const questions = await QuestionModel.getByUserId(Number(userId));
      return NextResponse.json({ success: true, questions });
    }

    // Здесь можно добавить логику для получения всех вопросов
    return NextResponse.json(
      { success: false, error: 'Not implemented' },
      { status: 501 }
    );

  } catch (error) {
    return NextResponse.json(
      { success: false},
      { status: 500 }
    );
  }
}

// POST /api/hr/questions - Создать новый вопрос
export async function POST(request: NextRequest) {
  try {
    const body: CreateQuestionRequest = await request.json();

    if (!body.text || !body.user_id) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const question = await QuestionModel.create(
      body.text,
      body.user_id,
      body.theme_id
    );

    return NextResponse.json(
      { success: true, question },
      { status: 201 }
    );

  } catch (error) {
    return NextResponse.json(
      { success: false },
      { status: 500 }
    );
  }
}

// PUT /api/hr/questions/answers - Добавить ответ
export async function PUT(request: NextRequest) {
  try {
    const body: CreateAnswerRequest = await request.json();

    if (!body.question_id || !body.text || !body.expert_id) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const result = await addAnswer(
      body.question_id,
      body.text,
      body.expert_id
    );

    return NextResponse.json(
      { success: true, answer: result.answer },
      { status: 201 }
    );

  } catch (error) {
    return NextResponse.json(
      { success: false,},
    );
  }
}

// Вспомогательная функция для добавления ответа
async function addAnswer(questionId: number, text: string, expertId: number) {
  const question = await QuestionModel.getById(questionId);
  if (!question) {
    throw new Error('Question not found');
  }

  const answer = await AnswerModel.create(questionId, text, expertId);
  await QuestionModel.updateStatus(questionId, 'answered');

  return { answer };
}