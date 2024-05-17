import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma"; // Импорт Prisma из lib/prisma

export const POST = async (req: NextRequest) => {
  try {
    const formData = await req.formData();
    const pageStr = formData.get("page");
    const pageSizeStr = formData.get("pageSize");

    // Проверка значений из FormData
    if (typeof pageStr !== "string" || typeof pageSizeStr !== "string") {
      return NextResponse.json(
        { message: "page или pageSize отсутствует или неверного типа" },
        { status: 400 }
      );
    }

    const page = parseInt(pageStr, 10);
    const pageSize = parseInt(pageSizeStr, 10);

    if (isNaN(page) || isNaN(pageSize)) {
      return NextResponse.json(
        { message: "Неверные значения page или pageSize" },
        { status: 400 }
      );
    }

    const skip = (page - 1) * pageSize;
    const take = pageSize;

    const services = await prisma.service.findMany({
      skip,
      take,
    });

    return NextResponse.json({ services }, { status: 200 });
  } catch (error) {
    console.error("Error occurred:", error);
    return NextResponse.json(
      { message: "Ошибка при получении списка услуг" },
      { status: 501 }
    );
  }
};
