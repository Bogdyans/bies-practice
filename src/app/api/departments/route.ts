import DepartmentController from "@/controllers/department";
import Jwt from "@/lib/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const decoded = await Jwt.getDecoded(request);
  if (!decoded || !("id" in decoded)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const formData = await request.formData();

  const name = formData.get("name") ? String(formData.get("name")) : null;
  const organizationId = formData.get("organization_id")
    ? Number(formData.get("organization_id"))
    : null;

  if (!name || !organizationId) {
    return NextResponse.json(
      { error: "Missing required fields" },

      { status: 500 }
    );
  }

  try {
    const department = await DepartmentController.createDepartment(
      name,
      organizationId
    );
    return NextResponse.json({ department }, { status: 200 });
  } catch {
    return NextResponse.json(
      { error: "Error creating department" },
      { status: 500 }
    );
  }
}
