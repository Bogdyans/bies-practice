import {NextRequest, NextResponse} from "next/server";
import Jwt from "@/lib/jwt";


export async function GET( request: NextRequest ) {
    const decoded = await Jwt.getDecoded(request);
    if (!decoded || !('id' in decoded)) {
        return NextResponse.json({error: 'Unauthorized'}, {status: 401});
    }


}