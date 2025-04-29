import { NextRequest, NextResponse } from "next/server";
import AuthController from "@/controllers/auth";

export async function POST(request: NextRequest): Promise<NextResponse> {
    try {
        const { login, password } = await request.json();
        const token = await AuthController.login(login, password);

        const response = NextResponse.json({ token });
        response.cookies.set("token", token, {
            httpOnly: true,
            maxAge: 24 * 60 * 60,  // Срок действия токена: 24 часа
        });

        return response;
    } catch {
        return NextResponse.json(
            {message: "Invalid username or password"},
            {status: 400}
        );
    }
}
