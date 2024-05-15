import { NextRequest, NextResponse } from "next/server";
import { db } from "@/shared/db";

export async function POST(req: NextRequest) {
  try {
    const { reviewId, content } = await req.json();
    await db.review.update({
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
