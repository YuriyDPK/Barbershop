import { NextRequest, NextResponse } from "next/server";
import { db } from "@/shared/db";

export async function POST(req: NextRequest) {
  try {
    const { reviewId } = await req.json();
    await db.review.delete({
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
