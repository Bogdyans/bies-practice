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