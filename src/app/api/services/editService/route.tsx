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
    // Проверка существования директории, если нет, то создать её
    try {
      await mkdir(assetsDir, { recursive: true });
    } catch (err) {
      console.error('Error creating directory:', err);
      throw err; // Выбросить ошибку в случае неудачи при создании директории
    }

    await writeFile(
      path.join(assetsDir, filename),
      buffer
    );

    const formDataObject = Object.fromEntries([...formData.entries()]);
    const { title, description } = formDataObject;
    const price = parseFloat(formDataObject.price.replace(',', '.')); // Преобразовать строку цены в тип Float
    const managerId = parseInt(formDataObject.managerId); // Преобразовать строку managerId в тип Int
    const id = parseInt(formDataObject.id); // Преобразовать строку id в тип Int
    const updatedService = await prisma.service.update({
      where: {
        id: parseInt(id as string), // Преобразовать id в целое число
      },
      data: {
        title,
        description,
        price,
        photo: filename,
        managerId,
      },
    });

    return NextResponse.json({ message: 'Service successfully updated', service: updatedService }, { status: 200 });
   // Продолжайте выполнение кода с использованием переменной 'id'...
  } catch (error) {
    console.error('Error occurred:', error);
    return NextResponse.json({ message: 'Ошибка при изменении услуги' }, { status: 501 });
  }
};
