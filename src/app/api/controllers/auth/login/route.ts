import { NextRequest, NextResponse } from "next/server";
import { SignJWT } from "jose";
import bcrypt from "bcryptjs";
import { getUserInfoByUsername } from "@/app/api/models/user";
import pool from "../../connect_to_bd/conectToBd";

//TODO: Затем в env закинуть
const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

export async function GET(request: NextRequest): Promise<NextResponse> {
  const client = await pool.connect();
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json(
        { message: "Username and password are required" },
        { status: 400 }
      );
    }

    // Запрос к базе данных для получения пользователя
    const user = await getUserInfoByUsername(client, username);

    // const res = await pool.query("SELECT * FROM users WHERE username = $1", [
    //   username,
    // ]);
    // const user = res.rows[0];

    if (!user) {
      return NextResponse.json(
        { message: "Invalid username or password" },
        { status: 401 }
      );
    }

    // Проверяем пароль
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json(
        { message: "Invalid username or password" },
        { status: 401 }
      );
    }

    // Создаем JWT token
    const token = await new SignJWT({
      username: user.username,
      // Add any additional claims you need
    })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("24h") // Token expires in 24 hours
      .sign(JWT_SECRET);

    const response = NextResponse.json({ token });
    response.cookies.set("token", token, {
      httpOnly: true,
      maxAge: 24 * 60 * 60, // 24 часа
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
