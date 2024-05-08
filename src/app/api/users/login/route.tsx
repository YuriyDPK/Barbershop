import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';
import { cookies } from 'next/headers';

const prisma = new PrismaClient();

export async function POST(request: NextRequest, response: NextResponse){

  const body = await request.json();
  
  const { email, password } = body;

  try {
    // Находим пользователя по email в базе данных
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      // Если пользователь с таким email не найден, возвращаем ошибку
      return NextResponse.json({ message: 'Пользователь с таким email не найден' }, { status: 404 });
    }

    // Проверяем, соответствует ли введенный пароль хэшу пароля пользователя
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      // Если пароль неверен, возвращаем ошибку
      return NextResponse.json({ message: 'Неверный пароль' }, { status: 401 });
    }

    // Успешная аутентификация
    // Устанавливаем email в куки
    cookies().set('email', `${email}`);

    // Если у пользователя роль "admin", также записываем ее в куки
    if (user.role === 'admin') {
      cookies().set('role', 'admin');
    }
    if (user.role === 'user') {
      cookies().set('role', 'user');
    }

    // Возвращаем сообщение об успешной аутентификации
    return NextResponse.json({ message: 'Вы успешно вошли в систему' }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Ошибка при аутентификации' }, { status: 500 });
  }
}
