import { PrismaClient } from "@prisma/client";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
const prisma = new PrismaClient();

// To handle a POST request to /api
export async function POST(req: NextRequest) {
  try {
    const user = await req.json();
    const emailCookie = req.cookies.get("email");

    const updatedUser = await prisma.user.update({
      where: { email: emailCookie?.value },
      data: { username: user.username, email: user.email },
    });

    cookies().set("email", `${updatedUser.email}`);
  } catch (error) {
    console.log(error);
  }

  return NextResponse.json({ message: "Hello World" }, { status: 200 });
}
