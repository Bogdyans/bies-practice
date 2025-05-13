import {NextRequest, NextResponse} from "next/server";
import QuestionController from "@/controllers/questions";
import Jwt from "@/lib/jwt";


export async function POST(request: NextRequest) {
    try {
        const decoded = await Jwt.getDecoded(request);
        if (!decoded) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 403 }
            );
        }

        const body = await request.json();

        if (!body.text || !body.theme) {
            return NextResponse.json(
                { error: 'Invalid input' },
                { status: 400 }
            );
        }

        await QuestionController.createNewQuestion(body.text, decoded.id, body.theme)

        return NextResponse.json(
            { status: 201 }
        );

    } catch {
        return NextResponse.json(
            { message: "Error creating question" },
            { status: 500 }
        );
    }
}



export async function GET( request: NextRequest ) {
    const decoded = await Jwt.getDecoded(request);
    if (!decoded || !('id' in decoded)) {
        return NextResponse.json({error: 'Unauthorized'}, {status: 401});
    }

    const { searchParams } = new URL(request.url);
    const orgId = parseInt(searchParams.get('organization') || '0', 10)
    const status = searchParams.get('status') || 'all'

    try {
        const questions = await QuestionController.getQuestions(decoded.id, orgId, status);
        return NextResponse.json({ questions },{ status: 200 });
    } catch {
        return NextResponse.json(
            { message: "Error getting questions" },
            { status: 500 }
        )
    }
}