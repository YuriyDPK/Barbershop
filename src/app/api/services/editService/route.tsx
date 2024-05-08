import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { writeFile, mkdir } from 'fs/promises'; // Added mkdir import
import path from 'path';

const prisma = new PrismaClient();

export const POST = async (req: NextRequest, res: NextResponse) => {
  try {

    const { id } = req.query;
    console.log(id);
    if (!id) {
      console.log(req.query);
      return NextResponse.json({ error: 'ID parameter is missing.' }, { status: 400 });
    }

    const formData = await req.formData();
    
    const file = formData.get('photo');

    if (!file) {
      return NextResponse.json({ error: 'No files received.' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const filename = file.name.replaceAll(' ', '_');
    
    const assetsDir = path.join(process.cwd(), 'public/assets');
    // Check if directory exists, if not, create it
    try {
      await mkdir(assetsDir, { recursive: true });
    } catch (err) {
      console.error('Error creating directory:', err);
      throw err; // Throw error in case of directory creation failure
    }

    await writeFile(
      path.join(assetsDir, filename),
      buffer
    );

    const formDataObject = Object.fromEntries([...formData.entries()]);
    const { title, description, photo } = formDataObject;
    const price = parseFloat(formDataObject.price.replace(',', '.')); // Convert price string to Float type
    const managerId = parseInt(formDataObject.managerId); // Convert managerId string to Int type

    const updatedService = await prisma.service.update({
      where: {
        id: parseInt(id as string), // Parse id to integer
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
   // Continue with the rest of your code using the 'id' variable...
  } catch (error) {
    console.error('Error occurred:', error);
    return NextResponse.json({ message: 'Ошибка при изменении услуги' }, { status: 501 });
  }
};
