import { NextResponse } from "next/server";
import { cookies } from 'next/headers';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
import { redirect } from 'next/navigation';

// To handle a GET request to /api
export async function GET(request: any) {
  try {
    // Извлечение данных пользователя из куки
    const emailCookie = request.cookies.get('email');
    const email = emailCookie ? emailCookie.value : null;

    if (!email) {
      // Возвращаем объект NextResponse.redirect с кодом состояния перенаправления и URL-адресом
      return NextResponse.redirect('http://localhost:3000/', { status: 307 });
    }

    // Поиск пользователя в базе данных по email
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "Пользователь не найден" }, { status: 404 });
    }

    // Удаление email из кук
    cookies().set('email', '', { maxAge: 0 });
    cookies().set('role', '', { maxAge: 0 });

    // Возврат информации о пользователе в формате JSON
    return NextResponse.redirect('http://localhost:3000/', { status: 307 });
  } catch (error) {
    console.error("Ошибка при обработке запроса:", error);
    return NextResponse.json({ error: "Что-то пошло не так" }, { status: 500 });
  }
}
