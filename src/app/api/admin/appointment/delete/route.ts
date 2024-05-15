import { NextRequest, NextResponse } from "next/server";
import { db } from "@/shared/db";

export async function POST(req: NextRequest) {
  try {
    const { appointmentId } = await req.json();
    await db.appointment.delete({
      where: { id: parseInt(appointmentId) },
    });
    return NextResponse.json({ message: "Appointment deleted successfully" });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete appointment" },
      { status: 500 }
    );
  }
}
