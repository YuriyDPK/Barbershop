import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { redirect } from "next/navigation";

const prisma = new PrismaClient();

export const POST = async (req: NextRequest, res: NextResponse) => {
  try {
    const formData = await req.formData();

    const file = formData.get("photo");

    if (!file) {
      return NextResponse.json(
        { error: "No files received." },
        { status: 400 }
      );
    }

    const buffer = await file.arrayBuffer(); // Change here
    const filename = file.name.replaceAll(" ", "_");

    const assetsDir = path.join(process.cwd(), "public/assets");
    try {
      await mkdir(assetsDir, { recursive: true });
    } catch (err) {
      console.error("Error creating directory:", err);
      throw err;
    }

    await writeFile(
      path.join(assetsDir, filename),
      Buffer.from(buffer) // Change here
    );

    const formDataObject = Object.fromEntries([...formData.entries()]);
    const { title, description } = formDataObject;
    const price = parseFloat(formDataObject.price.replace(",", "."));
    const managerId = parseInt(formDataObject.managerId);

    const newService = await prisma.service.create({
      data: {
        title,
        description,
        price,
        photo: filename,
        managerId,
      },
    });

    const redirectUrl = "/"; // Адрес главной страницы
    return new Response(null, {
      status: 303,
      headers: {
        Location: redirectUrl,
      },
    });
    return NextResponse.json(
      { message: "Услуга успешно добавлена", service: newService },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error occurred:", error);
    return NextResponse.json(
      { message: "Ошибка при добавлении услуги" },
      { status: 501 }
    );
  }
};
