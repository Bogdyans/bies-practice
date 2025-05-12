import {NextRequest, NextResponse} from "next/server";
import Jwt from "@/lib/jwt";
import OrganizationController from "@/controllers/organization";


export async function GET(request: NextRequest) {
    const decoded = await Jwt.getDecoded(request);
    if(!decoded) {
        return NextResponse.json(
            { error: 'Unauthorized' },
            { status: 403 }
        );
    }

    try {
        const organizationsData = await OrganizationController.getOrganizationsForUserWithRole(decoded.id);
        return NextResponse.json({ organizations: organizationsData }, { status: 200 });
    } catch {
        return NextResponse.json({ error: "Error getting organizations" }, { status: 500 });
    }
}