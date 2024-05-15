import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { unlink } from "fs/promises";
import path from "path";
import { revalidatePath } from "next/cache";

const prisma = new PrismaClient();

export const DELETE = async (req: NextRequest, res: NextResponse) => {
  try {
    // get id service from params
    const params = new URLSearchParams(req.nextUrl.search);
    const idParam = params.get("id");
    if (!idParam) {
      return NextResponse.json({ error: "No id provided." }, { status: 400 });
    }
    const id = parseInt(idParam, 10);
    if (isNaN(id)) {
      return NextResponse.json(
        { error: "Invalid id provided." },
        { status: 400 }
      );
    }

    // Удаляем все ожидающие заявки, связанные с удаленной услугой
    const deletedAppointments = prisma.appointment.deleteMany({
      where: { serviceId: id },
    });

    // Удаляем все отзывы, связанные с удаленной услугой
    const deletedReviews = prisma.review.deleteMany({
      where: { serviceId: id },
    });

    // Удаляем саму услугу
    const deletedService = prisma.service.delete({
      where: { id },
    });

    const transactionResults = await prisma.$transaction([
      deletedAppointments,
      deletedReviews,
      deletedService,
    ]);

    const [appointments, reviews, service] = transactionResults;

    if (!service) {
      return NextResponse.json(
        { error: "Service not found." },
        { status: 404 }
      );
    }

    const filename = service.photo;

    // Удалить файл изображения
    const filePath = path.join(process.cwd(), "public/assets", filename);
    try {
      await unlink(filePath);
    } catch (err) {
      console.error("Error deleting file:", err);
      throw err;
    }

    // Call revalidatePath to revalidate the necessary path
    // Assuming revalidatePath is available and properly imported
    await revalidatePath("/src/app/service"); // Change to the correct path you need to revalidate

    return NextResponse.json(
      { message: "Service successfully deleted", service },
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
