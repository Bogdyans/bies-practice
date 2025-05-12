
import { NextRequest, NextResponse } from "next/server";
import {ThemesController} from "@/controllers/themes";

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const orgId = Math.max(0, parseInt(searchParams.get('organizationId') || '0', 10));

    try {
        const themesData = await ThemesController.getThemesWithAnswerers(orgId);
        return NextResponse.json({ themes: themesData }, { status: 200 });
    } catch {
        return NextResponse.json({ error: "Error getting organizations" }, { status: 500 });
    }
}