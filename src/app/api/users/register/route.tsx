import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { username, email, password, phone } = body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        phone,
        role: "user",
      },
    });

    return new NextResponse(JSON.stringify({ message: "Вы зареганы" }), {
      status: 201,
      headers: {
        "Set-Cookie": `email=${email}; HttpOnly; Path=/; Max-Age=86400`,
      },
    });
  } catch (error) {
    console.error(error);
    return new NextResponse(
      JSON.stringify({ message: "Ошибка при регистрации пользователя" }),
      {
        status: 500,
      }
    );
  }
}
