import {NextRequest, NextResponse} from "next/server";
import Jwt from "@/lib/jwt";
import QuestionController from "@/controllers/questions";


export async function GET( request: NextRequest,
                          { params }: { params: { theme_name: string } } ) {
    const decoded = await Jwt.getDecoded(request);
    if (!decoded) {
        return NextResponse.json(
            { error: 'Unauthorized' },
            { status: 403 }
        );
    }

    const { theme_name } = params;

    try {
        const answerer_data = await QuestionController.getAnswererData(decoded.id, theme_name);

        return NextResponse.json({ answerer_data }, {status: 200})
    } catch {
        return NextResponse.json({ message: "Failed to get Answerer Data" }, { status: 500 } )
    }
}