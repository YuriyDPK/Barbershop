// src/shared/hooks/useUser.ts
import { cookies } from "next/headers";
import { db } from "@/shared/db";

export const useUser = async () => {
  const cookieStore = cookies();
  const role = cookieStore.get("role");
  const email = cookieStore.get("email")?.value ?? "";

  // Find the user by email to get their ID
  const user = await db.user.findUnique({ where: { email } });
  const userId = user?.id;

  return { userId, email, role };
};
