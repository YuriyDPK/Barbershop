import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { writeFile, mkdir, access } from "fs/promises";
import path from "path";

const prisma = new PrismaClient();

const allowedMimeTypes = [
  "image/png",
  "image/jpeg",
  "image/jpg",
  "image/svg+xml",
];

export const POST = async (req: NextRequest, res: NextResponse) => {
  const baseUrl = req.nextUrl.origin;

  try {
    const formData = await req.formData();
    const file = formData.get("photo");

    let filename = null;
    if (file && file instanceof File && file.name.length > 1) {
      const mimeType = file.type;
      if (!allowedMimeTypes.includes(mimeType)) {
        return NextResponse.redirect(
          `${baseUrl}/adminPanel?error=${encodeURIComponent(
            "Недопустимый тип файла."
          )}`
        );
      }

      const buffer = Buffer.from(await file.arrayBuffer());
      filename = file.name.replaceAll(" ", "_");

      const assetsDir = path.join(process.cwd(), "public/assets");

      // Создаем директорию, если её нет
      try {
        await mkdir(assetsDir, { recursive: true });
      } catch (err) {
        console.error("Ошибка при создании директории:", err);
        throw err;
      }

      const filePath = path.join(assetsDir, filename);

      // Проверяем существование файла и записываем его, если он не существует
      try {
        await access(filePath);
      } catch (err) {
        await writeFile(filePath, buffer);
      }
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
      updatedData.price = parseFloat(formDataObject.price.replace(",", "."));
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

    return NextResponse.redirect(`${baseUrl}/service/${formDataObject.id}`, {
      status: 307,
    });
  } catch (error) {
    console.error("Error occurred:", error);
    return NextResponse.json(
      { message: "Ошибка при изменении услуги" },
      { status: 501 }
    );
  }
};
