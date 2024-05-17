import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma"; // Импорт Prisma из lib/prisma

export async function POST(req: NextRequest) {
  try {
    const { appointmentId, status } = await req.json();
    await prisma.appointment.update({
      where: { id: parseInt(appointmentId) },
      data: { status },
    });
    return NextResponse.json({ message: "Appointment updated successfully" });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update appointment" },
      { status: 500 }
    );
  }
}
