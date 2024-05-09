import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { unlink, mkdir } from 'fs/promises'; // Заменен импорт writeFile на unlink
import path from 'path';

const prisma = new PrismaClient();

export const POST = async (req: NextRequest, res: NextResponse) => {
  try {
    const formData = await req.formData();
    const id = parseInt(formData.get('id')); // Извлечь id из formData

    const deletedService = await prisma.service.delete({
      where: { id },
    });

    if (!deletedService) {
      return NextResponse.json({ error: 'Service not found.' }, { status: 404 });
    }

    const filename = deletedService.photo;

    // Удалить файл изображения
    const assetsDir = path.join(process.cwd(), 'public/assets', filename);
    try {
      await unlink(assetsDir);
    } catch (err) {
      console.error('Error deleting file:', err);
      throw err;
    }

    return NextResponse.json({ message: 'Service successfully deleted', service: deletedService }, { status: 200 });
  } catch (error) {
    console.error('Error occurred:', error);
    return NextResponse.json({ message: 'Ошибка при удалении услуги' }, { status: 501 });
  }
};
