
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

export async function POST(request: NextRequest) {
  const decoded = await Jwt.getDecoded(request);
  if (!decoded || !("id" in decoded)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const formData = await request.formData();

  const name = formData.get("name") ? String(formData.get("name")) : null;

  if (!name) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 500 }
    );
  }

  try {
    const organization = await OrganizationController.createOrganization(name);
    return NextResponse.json({ organization }, { status: 200 });
  } catch {
    return NextResponse.json(
      { error: "Error creating organization" },
      { status: 500 }
    );
  }
}

