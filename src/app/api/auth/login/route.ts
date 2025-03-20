import { NextResponse } from "next/server"
import { SignJWT } from "jose"
import fs from "fs"
import path from "path"

//TODO: Затем в env закинуть
const JWT_SECRET = new TextEncoder().encode("6h3f595EujNEuqQWMbBVK9bHJTZM/cIXKspLsPG4NWR2ZyNhnHOO3FgWz85k+Mf8\n" +
    "1WO+lqpXgeYe8jIYvjg2SA==")

export async function POST(request: Request) {
    try {
        const { username, password } = await request.json()

        const usersFilePath = path.join(process.cwd(), "src/constants/mock/users.json")
        const usersData = fs.readFileSync(usersFilePath, "utf8")
        const users = JSON.parse(usersData)

        const user = users.find(
            (u: { username: string; password: string }) => u.username === username && u.password === password,
        )

        if (!user) {
            return NextResponse.json({ message: "Invalid username or password" }, { status: 401 })
        }

        // Create JWT token
        const token = await new SignJWT({
            username: user.username,
            // Add any additional claims you need
        })
            .setProtectedHeader({ alg: "HS256" })
            .setIssuedAt()
            .setExpirationTime("24h") // Token expires in 24 hours
            .sign(JWT_SECRET)

        return NextResponse.json({ token })
    } catch (error) {
        console.error("Login error:", error)
        return NextResponse.json({ message: "Internal server error" }, { status: 500 })
    }
}

