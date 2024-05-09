import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const POST = async (req: NextRequest, res: NextResponse) => {
  try {
    const formData = await req.formData();
    const formDataObject = Object.fromEntries([...formData.entries()]);
    const page = parseInt(formDataObject.page); // Преобразовать строку id в тип Int
    const pageSize = parseInt(formDataObject.pageSize); // Преобразовать строку id в тип Int
    const skip = (page - 1) * pageSize; // Рассчитать количество записей, которые нужно пропустить
    const take = pageSize; // Установить количество записей, которые нужно получить

    const services = await prisma.service.findMany({
      skip,
      take,
    });

    return NextResponse.json({ services }, { status: 200 });
  } catch (error) {
    console.error('Error occurred:', error);
    return NextResponse.json({ message: 'Ошибка при получении списка услуг' }, { status: 501 });
  }
};
