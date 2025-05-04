import RoleController from "@/controllers/role";
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
        const rolesData = await RoleController.getRoles();
        return NextResponse.json({ roles: rolesData }, { status: 200 });
    } catch {
        return NextResponse.json({ error: "Error getting roles" }, { status: 500 });
    }
}