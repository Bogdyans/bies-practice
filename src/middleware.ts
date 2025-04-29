import { NextResponse } from "next/server"
import { jwtVerify } from "jose"
import type { NextRequest } from "next/server"

//TODO: Затем в env закинуть

const JWT_SECRET = new TextEncoder().encode("6h3f595EujNEuqQWMbBVK9bHJTZM/cIXKspLsPG4NWR2ZyNhnHOO3FgWz85k+Mf8\n" +
    "1WO+lqpXgeYe8jIYvjg2SA==")


export async function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname

    const isPublicPath = path.startsWith("/login") || path === "/api/auth/login"

    if (isPublicPath) {
        return NextResponse.next()
    }


    const authHeader = request.headers.get("authorization")
    let token = request.cookies.get("token")?.value || ""

    if (authHeader && authHeader.startsWith("Bearer ")) {
        token = authHeader.substring(7)
    }

    if (!token) {
        if (path.startsWith("/api")) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }
        return NextResponse.redirect(new URL("/login", request.url));
    }


    try {

        await jwtVerify(token, JWT_SECRET)

        return NextResponse.next()
    } catch (error) {
        console.log(error);

        const response = NextResponse.redirect(new URL("/login", request.url));
        response.cookies.delete("token");

        return response;
    }
}

// See "Matching Paths" below to learn more
export const config = {
    matcher: [
        // Match all API routes except auth login
        "/api/:path*",
        // Match all protected routes
        "/((?!_next/static|_next/image|favicon.ico|media).*)",
    ],
}

