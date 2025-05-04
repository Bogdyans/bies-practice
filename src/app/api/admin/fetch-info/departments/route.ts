import DepartmentController from "@/controllers/department";
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

    const { searchParams } = new URL(request.url);
    const orgIdStr = searchParams.get('organization_id');
    const orgId = orgIdStr ? Number(orgIdStr) : null;
    if (orgId === null) throw new Error("Organization ID is required");

    try {
        const departmentsData = await DepartmentController.getDepartmentsByOrgId(orgId);
        return NextResponse.json({ departments: departmentsData }, { status: 200 });
    } catch {
        return NextResponse.json({ error: "Error getting departments" }, { status: 500 });
    }
}