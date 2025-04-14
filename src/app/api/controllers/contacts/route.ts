import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/app/api/utils/jwt';
import { fetchContacts } from '@/app/api/controllers/contacts/GetContacts';

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('token')?.value ||
                  request.headers.get('Authorization')?.split(' ')[1];

    if (!token) {
      return NextResponse.json({ error: 'Token is missing' }, { status: 401 });
    }

    const decoded = await verifyToken(token);
    if (!decoded || !('id' in decoded)) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || undefined;
    const offset = parseInt(searchParams.get('offset') || '0', 10);
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    const otdel_id = searchParams.get('otdel_id') ? parseInt(searchParams.get('otdel_id')!) : undefined;
    const location = searchParams.get('location') || undefined;

    const result = await fetchContacts({
      userId: decoded.id,
      search,
      offset,
      limit,
      otdel_id,
      location,
    });

    if ('error' in result) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    return NextResponse.json({ contacts: result.contacts }, { status: 200 });
  } catch (error) {
    console.error('Contacts API error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
