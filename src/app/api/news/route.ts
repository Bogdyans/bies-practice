import {NextRequest, NextResponse} from "next/server";
import Jwt from "@/lib/jwt";
import NewsController from "@/controllers/news";


export async function GET(request: NextRequest) {
    const decoded = await Jwt.getDecoded(request);
    if (!decoded || !('id' in decoded)) {
        return NextResponse.json({error: 'Unauthorized'}, {status: 401});
    }

    const { searchParams } = new URL(request.url);
    const offset = Math.max(0, parseInt(searchParams.get('offset') || '0', 10));
    const limit = Math.max(2, parseInt(searchParams.get('limit') || '2', 10));


    try {
        const { news, total } = await NewsController.getNews(decoded.id, limit, offset);

        return NextResponse.json({ news, total }, { status: 200 })
    } catch {
        return NextResponse.json({ message: "Error getting news"}, { status: 400 });
    }
}