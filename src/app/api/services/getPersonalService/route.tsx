import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const POST = async (req: NextRequest, res: NextResponse) => {
  try {
    const formData = await req.formData();
    const formDataObject = Object.fromEntries([...formData.entries()]);
    const id = parseInt(formData.get('id')); // Извлечь id из formData
    const services = await prisma.service.findUnique({
      where: { id },
    });

    return NextResponse.json({ services }, { status: 200 });
  } catch (error) {
    console.error('Error occurred:', error);
    return NextResponse.json({ message: 'Ошибка при получении списка услуг' }, { status: 501 });
  }
};
