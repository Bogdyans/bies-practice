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
    //console.log("Received login data:", { username, password });  // Логируем полученные данные

    if (!username || !password) {
      return NextResponse.json(
        { message: "Username and password are required" },
        { status: 400 }
      );
    }

    // Запрос к базе данных для получения пользователя
    const user = await getUserInfoByUsername(client, username);
    //console.log("User from database:", user);  // Логируем пользователя из базы данных

    if (!user || !(await bcrypt.compare(password, user.password_hash))) {
      return NextResponse.json(
        { message: "Invalid username or password" },
        { status: 401 }
      );
    }

    // Генерация JWT
    const token = await new SignJWT({
      username: user.login,
      id: user.id,
    })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("24h")
      .sign(JWT_SECRET);

    // Установка токена в cookie
    const response = NextResponse.json({ token });
    response.cookies.set("token", token, {
      httpOnly: true,
      maxAge: 24 * 60 * 60,  // Срок действия токена: 24 часа
    });

    return response;
  } catch (error) {
    //console.error("Login error:", error);  // Логируем ошибку
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}
