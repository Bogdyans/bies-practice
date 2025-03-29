import { NextRequest, NextResponse } from "next/server";
import { SignJWT } from "jose";
import bcrypt from "bcryptjs";
import { getUserInfoByUsername } from "@/app/api/models/user";
import pool from "@/app/api/controllers/connect_to_bd/conectToBd";

interface ILoginData {
  username: string;
  password: string;
}

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

export async function POST(request: NextRequest): Promise<NextResponse> {
  const client = await pool.connect();
  try {
    const { username, password }: ILoginData = await request.json();

    if (!username || !password) {
      return NextResponse.json(
        { message: "Username and password are required" },
        { status: 400 }
      );
    }

    // Запрос к базе данных для получения пользователя
    const user = await getUserInfoByUsername(client, username);

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return NextResponse.json(
        { message: "Invalid username or password" },
        { status: 401 }
      );
    }

    const token = await new SignJWT({
      username: user.username,
    })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("24h")
      .sign(JWT_SECRET);

    const response = NextResponse.json({ token });
    response.cookies.set("token", token, {
      httpOnly: true,
      maxAge: 24 * 60 * 60,
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}
