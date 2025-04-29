import {NextRequest, NextResponse} from 'next/server';
import ContactsController from "@/controllers/contacts";
import Jwt from "@/lib/jwt";


export async function GET(request: NextRequest) {
    try {
        const token = request.cookies.get('token')?.value ||
            request.headers.get('Authorization')?.split(' ')[1];

        if (!token) {
            return NextResponse.json({error: 'Token is missing'}, {status: 401});
        }

        const decoded = await Jwt.verifyToken(token);
        if (!decoded || !('id' in decoded)) {
            return NextResponse.json({error: 'Invalid token'}, {status: 401});
        }

        const {searchParams} = new URL(request.url);
        const search_str = searchParams.get('search_str') || undefined;
        const offset = parseInt(searchParams.get('offset') || '0', 10);
        const limit = parseInt(searchParams.get('limit') || '10', 10);

        const contacts = await ContactsController.getContacts({ user_id: decoded.id, search_str, limit, offset });

        return NextResponse.json({ contacts: contacts }, { status: 200 })
    } catch {
        return NextResponse.json(
            { message: 'Failed to get contacts'},
            { status: 400 }
        )
    }
}
