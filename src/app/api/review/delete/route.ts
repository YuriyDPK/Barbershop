import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma"; // Импорт Prisma из lib/prisma

export async function POST(req: NextRequest) {
  try {
    const { reviewId } = await req.json();
    await prisma.review.delete({
      where: { id: parseInt(reviewId) },
    });
    return NextResponse.json({ message: "Review deleted successfully" });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete review" },
      { status: 500 }
    );
  }
}
