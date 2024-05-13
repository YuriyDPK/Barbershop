import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { writeFile, mkdir, access } from 'fs/promises'; // Добавлен импорт access
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

    // Создаем директорию, если её нет
    try {
      await mkdir(assetsDir, { recursive: true });
    } catch (err) {
      console.error('Error creating directory:', err);
      throw err;
    }

    const filePath = path.join(assetsDir, filename);

    // Проверяем существование файла
    try {
      await access(filePath);
    } catch (err) {
      // Если файла нет, записываем его
      await writeFile(filePath, buffer);
    }

    const formDataObject = Object.fromEntries([...formData.entries()]);
    const updatedData: any = {}; // Создаем объект для хранения обновленных данных

    // Проверяем наличие данных и обновляем их
    if (formDataObject.title) {
      updatedData.title = formDataObject.title;
    }

    if (formDataObject.description) {
      updatedData.description = formDataObject.description;
    }

    if (formDataObject.price) {
      updatedData.price = parseFloat(formDataObject.price.replace(',', '.'));
    }

    if (formDataObject.managerId) {
      updatedData.managerId = parseInt(formDataObject.managerId);
    }

    if (formDataObject.id) {
      updatedData.id = parseInt(formDataObject.id);
    }

    if (filename) {
      updatedData.photo = filename;
    }

    const updatedService = await prisma.service.update({
      where: {
        id: updatedData.id,
      },
      data: updatedData,
    });

    return NextResponse.json({ message: 'Service successfully updated', service: updatedService }, { status: 200 });
  } catch (error) {
    console.error('Error occurred:', error);
    return NextResponse.json({ message: 'Ошибка при изменении услуги' }, { status: 501 });
  }
};
