import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma"; // Импорт Prisma из lib/prisma
import { writeFile, mkdir, access } from "fs/promises";
import path from "path";

const allowedMimeTypes = [
  "image/png",
  "image/jpeg",
  "image/jpg",
  "image/svg+xml",
];

export const POST = async (req: NextRequest) => {
  const baseUrl = req.nextUrl.origin;

  let formDataObject: any = {};

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

    formDataObject = Object.fromEntries(Array.from(formData.entries()));
    const updatedData: any = {}; // Создаем объект для хранения обновленных данных

    // Проверяем наличие данных и обновляем их
    if (
      typeof formDataObject.title === "string" &&
      formDataObject.title.trim() !== ""
    ) {
      updatedData.title = formDataObject.title;
    }

    if (
      typeof formDataObject.description === "string" &&
      formDataObject.description.trim() !== ""
    ) {
      updatedData.description = formDataObject.description;
    }

    if (
      typeof formDataObject.price === "string" &&
      formDataObject.price.trim() !== ""
    ) {
      updatedData.price = parseFloat(formDataObject.price.replace(",", "."));
    }

    if (
      typeof formDataObject.managerId === "string" &&
      formDataObject.managerId.trim() !== ""
    ) {
      updatedData.managerId = parseInt(formDataObject.managerId, 10);
    }

    if (
      typeof formDataObject.id === "string" &&
      formDataObject.id.trim() !== ""
    ) {
      updatedData.id = parseInt(formDataObject.id, 10);
    } else {
      return NextResponse.redirect(
        `${baseUrl}/adminPanel?error=${encodeURIComponent(
          "Отсутствует ID услуги."
        )}`
      );
    }

    if (filename) {
      updatedData.photo = filename;
    }

    if (Object.keys(updatedData).length === 0) {
      return NextResponse.redirect(
        `${baseUrl}/adminPanel?error=${encodeURIComponent(
          "Нет данных для обновления."
        )}`
      );
    }

    const updatedService = await prisma.service.update({
      where: {
        id: updatedData.id,
      },
      data: updatedData,
    });

    return NextResponse.redirect(`${baseUrl}/service/${updatedData.id}`);
  } catch (error) {
    console.error("Error occurred:", error);
    return NextResponse.redirect(
      `${baseUrl}/service/${
        typeof formDataObject.id === "string" ? formDataObject.id : ""
      }?error=${encodeURIComponent("Ошибка при изменении услуги.")}`
    );
  }
};
