import { NextRequest, NextResponse } from 'next/server';
import { NotificationModel } from '../../models/notifications';

// GET /api/notifications - Получить уведомления
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('user_id');
    
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Parameter user_id is required' },
        { status: 400 }
      );
    }

    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');
    const unreadOnly = searchParams.get('unread_only') === 'true';

    const notifications = await NotificationModel.getByUserId(
      parseInt(userId),
      limit,
      offset,
      unreadOnly
    );

    return NextResponse.json({
      success: true,
      data: notifications
    });

  } catch (error) {
    return NextResponse.json(
      { 
        success: false, 
      },
      { status: 500 }
    );
  }
}

// POST /api/notifications - Создать уведомление
export async function POST(request: NextRequest) {
  try {
    const { user_id, title, date } = await request.json();

    if (!user_id || !title) {
      return NextResponse.json(
        { success: false, error: 'Required fields: user_id, title' },
        { status: 400 }
      );
    }

    const notification = await NotificationModel.create(
      user_id,
      title,
      date ? new Date(date) : undefined
    );

    return NextResponse.json(
      { success: true, data: notification },
      { status: 201 }
    );

  } catch (error) {
    return NextResponse.json(
      { success: false, },
      { status: 500 }
    );
  }
}