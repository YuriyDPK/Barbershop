import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { unlink } from "fs/promises";
import path from "path";
import { revalidatePath } from "next/cache";

const prisma = new PrismaClient();

export const DELETE = async (req: NextRequest, res: NextResponse) => {
  try {
    // Get service ID from query parameters
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

    // Get the service to be deleted
    const service = await prisma.service.findUnique({
      where: { id },
    });

    if (!service) {
      return NextResponse.json(
        { error: "Service not found." },
        { status: 404 }
      );
    }

    const filename = service.photo;

    // Delete related appointments and reviews
    const deletedAppointments = prisma.appointment.deleteMany({
      where: { serviceId: id },
    });
    const deletedReviews = prisma.review.deleteMany({
      where: { serviceId: id },
    });
    const deletedService = prisma.service.delete({
      where: { id },
    });

    // Execute the deletions in a transaction
    const transactionResults = await prisma.$transaction([
      deletedAppointments,
      deletedReviews,
      deletedService,
    ]);

    // Check if other services still use the same photo
    const otherServicesWithSamePhoto = await prisma.service.findMany({
      where: { photo: filename },
    });

    // If no other services use the same photo, delete the photo file
    if (otherServicesWithSamePhoto.length === 0) {
      const filePath = path.join(process.cwd(), "public/assets", filename);
      try {
        await unlink(filePath);
      } catch (err) {
        console.error("Error deleting file:", err);
        // Handle the error but proceed with the response
      }
    }

    // Revalidate the necessary path
    await revalidatePath("/service"); // Adjust the path as needed

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
