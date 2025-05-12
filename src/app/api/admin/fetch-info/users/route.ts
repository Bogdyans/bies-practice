
import { NextRequest, NextResponse } from "next/server";
import OrganizationController from "@/controllers/organization";

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const orgId = Math.max(0, parseInt(searchParams.get('organizationId') || '0', 10));

    try {
        const users = await OrganizationController.findAllUsers(orgId);
        return NextResponse.json({ users }, { status: 200 });
    } catch {
        return NextResponse.json({ error: "Error getting users" }, { status: 500 });
    }
}