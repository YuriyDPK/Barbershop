import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma"; // Импорт Prisma из lib/prisma

export async function POST(req: NextRequest) {
  try {
    const { reviewId, content } = await req.json();
    await prisma.review.update({
      where: { id: parseInt(reviewId) },
      data: { content },
    });
    return NextResponse.json({ message: "Review edited successfully" });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to edit review" },
      { status: 500 }
    );
  }
}
