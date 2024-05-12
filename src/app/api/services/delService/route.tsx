import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { unlink, mkdir } from "fs/promises"; // Заменен импорт writeFile на unlink
import path from "path";

const prisma = new PrismaClient();

export const DELETE = async (req: NextRequest, res: NextResponse) => {
  try {
    // get id service from params
    const params = new URLSearchParams(req.nextUrl.search);
    const id = parseInt(params.get("id")); // Извлечь id из params
    // const formData = await req.formData();
    // const id = parseInt(formData.get("id")); // Извлечь id из formData

    // Удаляем все ожидающие заявки, связанные с удаленной услугой
    await prisma.appointment.deleteMany({
      where: { serviceId: id },
    });

    // Удаляем все отзывы, связанные с удаленной услугой
    await prisma.review.deleteMany({
      where: { serviceId: id },
    });

    // Удаляем саму услугу
    const deletedService = await prisma.service.delete({
      where: { id },
    });

    await prisma.$transaction([
      deletedService,
      deletedServiceFromAppoinemnt,
      deletedServiceFromReview,
    ]);

    if (!deletedService) {
      return NextResponse.json(
        { error: "Service not found." },
        { status: 404 }
      );
    }

    const filename = deletedService.photo;

    // Удалить файл изображения
    const assetsDir = path.join(process.cwd(), "public/assets", filename);
    try {
      await unlink(assetsDir);
    } catch (err) {
      console.error("Error deleting file:", err);
      throw err;
    }

    return NextResponse.json(
      { message: "Service successfully deleted", service: deletedService },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error occurred:", error);
    return NextResponse.json(
      { message: "Ошибка при удалении услуги" },
      { status: 501 }
    );
  }
};
