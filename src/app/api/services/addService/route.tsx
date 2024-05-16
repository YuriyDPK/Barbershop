import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

const prisma = new PrismaClient();

export const POST = async (req: NextRequest, res: NextResponse) => {
  try {
    const formData = await req.formData();

    const file = formData.get("photo");

    if (!file || !(file instanceof File)) {
      return NextResponse.json(
        { error: "No files received or file is invalid." },
        { status: 400 }
      );
    }

    const buffer = await file.arrayBuffer();
    const filename = file.name.replaceAll(" ", "_");

    const assetsDir = path.join(process.cwd(), "public/assets");
    try {
      await mkdir(assetsDir, { recursive: true });
    } catch (err) {
      console.error("Error creating directory:", err);
      throw err;
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
      return NextResponse.json(
        { error: "Invalid form data." },
        { status: 400 }
      );
    }

    const price = parseFloat(priceString.replace(",", "."));
    const managerId = parseInt(managerIdString, 10);

    const newService = await prisma.service.create({
      data: {
        title,
        description,
        price,
        photo: filename,
        managerId,
      },
    });

    const redirectUrl = "/service"; // Адрес главной страницы
    return new Response(null, {
      status: 303,
      headers: {
        Location: redirectUrl,
      },
    });
  } catch (error) {
    console.error("Error occurred:", error);
    return NextResponse.json(
      { message: "Ошибка при добавлении услуги" },
      { status: 501 }
    );
  }
};
