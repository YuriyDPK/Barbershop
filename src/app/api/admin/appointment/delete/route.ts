import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma"; // Импорт Prisma из lib/prisma

export async function POST(req: NextRequest) {
  try {
    const { appointmentId } = await req.json();
    await prisma.appointment.delete({
      where: { id: parseInt(appointmentId) },
    });
    return NextResponse.json({ message: "Appointment deleted successfully" });
  } catch (error) {
    console.error("Error deleting appointment:", error);
    return NextResponse.json(
      { error: "Failed to delete appointment" },
      { status: 500 }
    );
  }
}
