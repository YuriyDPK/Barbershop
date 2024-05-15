import { NextRequest, NextResponse } from "next/server";
import { db } from "@/shared/db";

export async function POST(req: NextRequest) {
  try {
    const { appointmentId, status } = await req.json();
    await db.appointment.update({
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
