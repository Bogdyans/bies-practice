import {NextRequest, NextResponse} from "next/server";
import AdminController from "@/controllers/admin";


export async function POST(request: NextRequest) {
    const body = await request.json();

    if (!body.themeId || !body.userId || !body.organizationId) {
        return NextResponse.json(
            { error: 'Invalid input' },
            { status: 400 }
        );
    }

    try {
        await AdminController.setAnswerer(body.organizationId, body.themeId, body.userId);
        return NextResponse.json({status: 200})
    } catch {
        return NextResponse.json({ error: 'Failed to answer'}, {status: 500});
    }
}