import { NextRequest, NextResponse } from 'next/server';
import { NotificationModel } from '../../models/notifications';
import { verifyToken } from '@/app/api/utils/jwt';
import pool from '@/app/api/controllers/connect_to_bd/conectToBd';

export async function GET(request: NextRequest) {
  const client = await pool.connect();
  try {
    // 1. Проверка токена
    const authHeader = request.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, error: 'Missing authorization token' },
        { status: 401 }
      );
    }

    const token = authHeader.split(' ')[1];
    const decoded = await verifyToken(token);
    
    if (!decoded?.id) {
      return NextResponse.json(
        { success: false, error: 'Invalid token' },
        { status: 401 }
      );
    }

    // 2. Получение параметров запроса
    const searchParams = request.nextUrl.searchParams;
    const limit = Math.min(Number(searchParams.get('limit') || 20),100);
    const offset = Number(searchParams.get('offset') || 0);
    const unreadOnly = searchParams.get('unread_only') === 'true';

    // 3. Получение уведомлений
    const notifications = await NotificationModel.getByUserId(
      decoded.id, // Только user_id, без передачи client
      limit,
      offset,
      unreadOnly
    );

    return NextResponse.json({
      success: true,
      data: notifications
    });

  } catch (error) {
    console.error('Notification fetch error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}