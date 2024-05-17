import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma"; // Импорт Prisma из lib/prisma
import { writeFile, mkdir } from "fs/promises";
import path from "path";

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

    if (!file || !(file instanceof File)) {
      return NextResponse.redirect(
        `${baseUrl}/adminPanel?error=${encodeURIComponent(
          "Файл не получен или файл недействителен."
        )}`
      );
    }

    const mimeType = file.type;
    if (!allowedMimeTypes.includes(mimeType)) {
      return NextResponse.redirect(
        `${baseUrl}/adminPanel?error=${encodeURIComponent(
          "Недопустимый тип файла."
        )}`
      );
    }

    const buffer = await file.arrayBuffer();
    const filename = file.name.replaceAll(" ", "_");

    const assetsDir = path.join(process.cwd(), "public/assets");
    try {
      await mkdir(assetsDir, { recursive: true });
    } catch (err) {
      console.error("Ошибка при создании директории:", err);
      return NextResponse.redirect(
        `${baseUrl}/adminPanel?error=${encodeURIComponent(
          "Ошибка при создании директории."
        )}`
      );
    }

    await writeFile(path.join(assetsDir, filename), Buffer.from(buffer));

    const formDataObject = Object.fromEntries(formData.entries());
    const {
      title,
      description,
      price: priceString,
      managerId: managerIdString,
    } = formDataObject;

    if (
      typeof title !== "string" ||
      typeof description !== "string" ||
      typeof priceString !== "string" ||
      typeof managerIdString !== "string"
    ) {
      return NextResponse.redirect(
        `${baseUrl}/adminPanel?error=${encodeURIComponent(
          "Неверные данные формы."
        )}`
      );
    }

    const price = parseFloat(priceString.replace(",", "."));
    const managerId = parseInt(managerIdString, 10);

    await prisma.service.create({
      data: {
        title,
        description,
        price,
        photo: filename,
        managerId,
      },
    });

    return NextResponse.redirect(
      `${baseUrl}/service?message=${encodeURIComponent("Услуга добавлена.")}`
    );
  } catch (error) {
    console.error("Произошла ошибка:", error);
    return NextResponse.redirect(
      `${baseUrl}/adminPanel?error=${encodeURIComponent(
        "Ошибка при добавлении услуги."
      )}`
    );
  }
};
