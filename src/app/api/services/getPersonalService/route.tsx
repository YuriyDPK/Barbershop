import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma"; // Импорт Prisma из lib/prisma

export const POST = async (req: NextRequest) => {
  try {
    const formData = await req.formData();
    const idStr = formData.get("id");

    if (typeof idStr !== "string") {
      return NextResponse.json(
        { message: "ID отсутствует или неверного типа" },
        { status: 400 }
      );
    }

    const id = parseInt(idStr, 10);
    if (isNaN(id)) {
      return NextResponse.json({ message: "Неверный ID" }, { status: 400 });
    }

    const services = await prisma.service.findUnique({
      where: { id },
    });

    if (!services) {
      return NextResponse.json(
        { message: "Услуга не найдена" },
        { status: 404 }
      );
    }

    return NextResponse.json({ services }, { status: 200 });
  } catch (error) {
    console.error("Error occurred:", error);
    return NextResponse.json(
      { message: "Ошибка при получении списка услуг" },
      { status: 501 }
    );
  }
};
