import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/app/api/utils/jwt';
import { fetchUserById } from '@/app/api/controllers/profile/GetUserById';

export async function GET(request: NextRequest) {
  try {
    // 1. Получаем токен из куки или заголовка
    const token = request.cookies.get('token')?.value || 
                 request.headers.get('Authorization')?.split(' ')[1];

    if (!token) {
      return NextResponse.json({ error: 'Token is missing' }, { status: 401 });
    }

    // 2. Проверяем токен
    const decoded = await verifyToken(token);
    if (!decoded || !('id' in decoded)) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    // 3. Получаем данные пользователя
    const result = await fetchUserById({ id: decoded.id });

    if ('error' in result) {
      return NextResponse.json({ error: result.error }, { status: 404 });
    }

    return NextResponse.json({ user: result.user }, { status: 200 });
  } catch (error) {
    console.error('Error in GET request:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

