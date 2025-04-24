import {NextRequest, NextResponse} from "next/server";
import Jwt from "@/lib/jwt";
import NotificationsController from "@/controllers/notifications";


export async function GET(request: NextRequest) {
    const decoded = await Jwt.getDecoded(request);
    if (!decoded || !('id' in decoded)) {
        return NextResponse.json({error: 'Unauthorized'}, {status: 403});
    }

    try {
        const notifications = await NotificationsController.findAllForUser(decoded.id);
        return NextResponse.json({ notifications }, {status: 200 });
    } catch {
        return NextResponse.json({error: 'Error getting notifications'}, {status: 500});
    }
}

export async function PATCH(request: NextRequest) {
    const decoded = await Jwt.getDecoded(request);
    if (!decoded || !('id' in decoded)) {
        return NextResponse.json({error: 'Unauthorized'}, {status: 403});
    }

    const data = await request.json();

    try {
        await NotificationsController.changeIsRead(decoded.id, data.id, true);
        return NextResponse.json({ status: 200 });
    } catch {
        return NextResponse.json({ error: "Error changing status of notification"}, {status: 500})
    }
}

export async function DELETE(request: NextRequest) {
    const decoded = await Jwt.getDecoded(request);
    if (!decoded || !('id' in decoded)) {
        return NextResponse.json({error: 'Unauthorized'}, {status: 403});
    }

    const data = await request.json();

    try {
        await NotificationsController.delete(decoded.id, data.id);
        return NextResponse.json({ status: 200 });
    } catch {
        return NextResponse.json({ error: "Error deleting notification"}, {status: 500})
    }
}