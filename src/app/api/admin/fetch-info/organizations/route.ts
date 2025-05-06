import OrganizationController from "@/controllers/organization";
import Jwt from "@/lib/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    const decoded = await Jwt.getDecoded(request);
    if(!decoded) {
        return NextResponse.json(
            { error: 'Unauthorized' },
            { status: 403 }
        );
    }

    try {
        const organizationsData = await OrganizationController.getOrganizations();
        return NextResponse.json({ organizations: organizationsData }, { status: 200 });
    } catch {
        return NextResponse.json({ error: "Error getting organizations" }, { status: 500 });
    }
}