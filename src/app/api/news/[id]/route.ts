import {NextRequest, NextResponse} from "next/server";
import NewsController from "@/controllers/news";
import Jwt from "@/lib/jwt";


export async function GET(request: NextRequest,
                    { params }: { params: { id: number } } )
{
    try {
        const decoded = await Jwt.getDecoded(request);
        if (!decoded) {
            return NextResponse.json({ status: 403 });
        }

        const resolvedParams = await params;
        const id = resolvedParams.id;

        const newsData = await NewsController.getNewsById(decoded.id, id);
        return NextResponse.json({ newsData }, { status: 200 })
    }    catch {
        return NextResponse.json({ error: "Error getting news" }, {status: 500});
    }
}