import { db } from "@/shared/db";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { cookies } from "next/headers";

export default async function Service() {
  const cookieStore = cookies();
  const role = cookieStore.get("role");
  if (role && role.value === "admin") {
    return <div>Админ момент</div>;
  } else {
    return (
      <div>
        Упс... вы можете вернуться назад <Link href="/">Вернуться</Link>
      </div>
    );
  }
}
