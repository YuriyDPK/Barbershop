import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";
import { cookies } from "next/headers";
const prisma = new PrismaClient();

export async function POST(request: NextRequest, response: NextResponse) {
  const body = await request.json();

  const { username, email, password, phone } = body;

  try {
    // Хешируем пароль
    const hashedPassword = await bcrypt.hash(password, 10);

    // Сохраняем пользователя в базе данных
    const user = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        phone,
        role: "user",
      },
    });

    cookies().set("email", `${email}`);
    cookies().set("role", "user");
    // Отправляем ответ с токеном и куками
    return NextResponse.json({ message: "Вы зареганы" }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Ошибка при регистрации пользователя" },
      { status: 500 }
    );
  }
}
