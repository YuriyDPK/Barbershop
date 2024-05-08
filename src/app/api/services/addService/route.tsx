import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { writeFile, mkdir } from 'fs/promises'; // Добавлен импорт mkdir
import path from 'path';

const prisma = new PrismaClient();

export const POST = async (req: NextRequest, res: NextResponse) => {
  try {
    const formData = await req.formData();
    
    const file = formData.get('photo');

    if (!file) {
      return NextResponse.json({ error: 'No files received.' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const filename = file.name.replaceAll(' ', '_');
    
    const assetsDir = path.join(process.cwd(), 'public/assets');
    // Проверяем существует ли директория, если нет, создаем её
    try {
      await mkdir(assetsDir, { recursive: true });
    } catch (err) {
      console.error('Error creating directory:', err);
      throw err; // Выбрасываем ошибку в случае неудачи создания директории
    }

    await writeFile(
      path.join(assetsDir, filename),
      buffer
    );

    const formDataObject = Object.fromEntries([...formData.entries()]);
    const { title, description, photo } = formDataObject;
    const price = parseFloat(formDataObject.price.replace(',', '.')); // Преобразование строки price в тип Float
    const managerId = parseInt(formDataObject.managerId); // Преобразование строки managerId в тип Int

    const newService = await prisma.service.create({
      data: {
        title,
        description,
        price,
        photo: filename,
        managerId,
      },
    });

    return NextResponse.json({ message: 'Услуга успешно добавлена', service: newService }, { status: 201 });
  } catch (error) {
    console.error('Error occurred:', error);
    return NextResponse.json({ message: 'Ошибка при добавлении услуги' }, { status: 501 });
  }
};
