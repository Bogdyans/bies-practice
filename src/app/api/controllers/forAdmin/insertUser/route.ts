import { NextRequest, NextResponse } from "next/server";
import { createUser, NewUserData } from "@/app/api/models/role/admin/addNewUser";
import db from "@/app/api/controllers/connect_to_bd/conectToBd";
import { verifyToken } from "@/app/api/utils/jwt";  // Функция для верификации токена

// Экспортируем обработчик для метода POST как именованный экспорт
export async function POST(req: NextRequest) {
  // Шаг 1: Проверка метода запроса
  if (req.method !== "POST") {
    return NextResponse.json({ message: "Метод не поддерживается" }, { status: 405 });
  }

  // Шаг 2: Получаем токен из заголовков или куки
  const token = req.cookies.get('token')?.value || req.headers.get('Authorization')?.split(' ')[1];

  if (!token) {
    return NextResponse.json({ message: "Токен отсутствует. Доступ запрещен." }, { status: 401 });
  }

  //console.log("Полученный токен:", token);  // Логирование токена

  try {
    // Шаг 3: Верификация токена
    const decoded = await verifyToken(token); // Ваша функция для верификации токена
    if (!decoded || !('id' in decoded)) {
      return NextResponse.json({ message: "Неверный токен" }, { status: 401 });
    }

    const userId = decoded.id;
    //console.log("Пользователь с ID:", userId);  // Логирование ID пользователя

    // Шаг 4: Проверка роли пользователя (должен быть администратор)
    const client = await db.connect();
    try {
      const userRoleResult = await client.query(
        'SELECT role_id FROM "User" WHERE id = $1',  // Исправлено на "User"
        [userId]
      );

      // Если пользователя нет или роль не найдена
      if (userRoleResult.rows.length === 0) {
        return NextResponse.json({ message: 'Пользователь не найден' }, { status: 404 });
      }

      const roleId = userRoleResult.rows[0].role_id;
      // Проверка на роль администратора (например, роль администратора = 1)
      if (roleId != 1) {
        return NextResponse.json({ message: 'Только администратор может создавать пользователей' }, { status: 403 });
      }

      // Шаг 5: Извлекаем данные нового пользователя из тела запроса
      const userData: NewUserData = await req.json();

      // Шаг 6: Создаем нового пользователя
      try {
        await client.query("BEGIN");

        const newUserId = await createUser(client, userData);

        await client.query("COMMIT");
        return NextResponse.json({ message: "Пользователь создан", userId: newUserId }, { status: 201 });
      } catch (err) {
        await client.query("ROLLBACK");
        console.error("Ошибка при создании пользователя:", err);
        return NextResponse.json({ message: "Ошибка при создании пользователя" }, { status: 500 });
      }
    } finally {
      client.release();
    }
  } catch (err) {
    console.error("Ошибка при обработке запроса:", err);
    return NextResponse.json({ message: 'Ошибка при проверке токена' }, { status: 500 });
  }
}
