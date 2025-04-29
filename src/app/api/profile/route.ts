import {NextRequest, NextResponse} from "next/server";
import Jwt from "@/lib/jwt";
import ProfileController from "@/controllers/profile";


export async function GET(request: NextRequest) {
    const decoded = await Jwt.getDecoded(request);
    if (!decoded) {
        return NextResponse.json(
            { error: 'Unauthorized' },
            { status: 403 }
        );
    }

    try {
        const profileData = await ProfileController.getProfileById(decoded.id);

        return NextResponse.json({ profileData: profileData }, { status: 200 });
    } catch {
        return NextResponse.json({ error: "Error getting profile" }, { status: 500 });
    }
}