import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// To handle a GET request to /api
export async function GET(request: NextRequest) {
  try {
    // Извлечение данных пользователя из куки
    const emailCookie = request.cookies.get("email");
    const email = emailCookie ? emailCookie.value : null;
    if (!email) {
      return NextResponse.json(
        { error: "Пользователь не аутентифицирован" },
        { status: 401 }
      );
    }

    // Поиск пользователя в базе данных по email
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Пользователь не найден" },
        { status: 404 }
      );
    }

    // Возврат информации о пользователе в формате JSON
    return NextResponse.json({ user }, { status: 200 });
  } catch (error) {
    console.error("Ошибка при обработке запроса:", error);
    return NextResponse.json({ error: "Что-то пошло не так" }, { status: 500 });
  }
}
