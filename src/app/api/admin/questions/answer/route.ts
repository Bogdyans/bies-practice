import {NextRequest, NextResponse} from "next/server";
import QuestionController from "@/controllers/questions";


export async function POST(request: NextRequest){
    const body = await request.json();

    if (!body.text || !body.question_id) {
        return NextResponse.json(
            { error: 'Invalid input' },
            { status: 400 }
        );
    }

    try {
        await QuestionController.createNewAnswer(body.question_id, body.text);

        return NextResponse.json(
            { status: 201 }
        );
    } catch {
        return NextResponse.json({ error: 'Failed to answer'}, {status: 500});
    }
}