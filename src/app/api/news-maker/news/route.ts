import { NextRequest, NextResponse } from 'next/server';
import Jwt from "@/lib/jwt";
import NewsController from "@/controllers/news"; // для уникальных имён файлов

export async function POST(request: NextRequest) {
    const decoded = await Jwt.getDecoded(request);
    if (!decoded) {
        return NextResponse.json(
            { error: 'Unauthorized' },
            { status: 403 }
        );
    }

    const formData = await request.formData();

    const title = formData.get('title') as string;
    const content = formData.get('content') as string;
    const images = formData.getAll('images') as File[];

    try {
        await NewsController.createNews(decoded.id, title, content, images);

        return NextResponse.json({ status: 201 });
    } catch {
        return NextResponse.json({ message: "Error creating News" }, { status: 500 });
    }
}
