import { db } from "@/shared/db";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { cookies } from "next/headers";

export default async function Service() {
  const cookieStore = cookies();
  const role = cookieStore.get("role");
  const email = cookieStore.get("email").value;

  // Find the user by email to get their ID
  const user = await db.user.findUnique({ where: { email } });
  const userId = user?.id;

  return (
    <div className="p-4 lg:w-1/3 mx-auto">
      <h2 className="text-2xl font-semibold mb-4 text-black text-center">
        Добавить товар
      </h2>
      <form
        className="space-y-3"
        method="POST"
        action="/api/services/addService"
        enctype="multipart/form-data"
      >
        <input
          type="text"
          id="title"
          name="title"
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-black/80"
          placeholder="Название услуги"
          required
        />
        <input
          type="text"
          id="managerId"
          name="managerId"
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-black/80"
          value={userId}
          hidden
        />
        <input
          type="text"
          id="description"
          name="description"
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-black/80"
          placeholder="Описание"
          required
        />
        <input
          type="number"
          id="price"
          name="price"
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-black/80"
          placeholder="Стоимость"
          required
        />
        <input
          type="file"
          id="photo"
          name="photo"
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-black/80"
          placeholder="Выберите файл"
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600"
        >
          Добавить
        </button>
      </form>
    </div>
  );
}
