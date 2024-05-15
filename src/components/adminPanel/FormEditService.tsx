import React from "react";
import { cookies } from "next/headers";
import { db } from "@/shared/db";
export default async function FormEditService({
  serviceId,
}: {
  serviceId: number;
}) {
  const cookieStore = cookies();
  const role = cookieStore.get("role");
  const email = cookieStore.get("email")?.value ?? "";

  // Find the user by email to get their ID
  const user = await db.user.findUnique({ where: { email } });
  const userId = user?.id;
  return (
    <div className=" mt-24">
      <h1>Редактировать услугу</h1>
      <form
        className="space-y-3"
        method="POST"
        action="/api/services/editService"
        encType="multipart/form-data"
      >
        <input
          type="text"
          id="title"
          name="title"
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-black/80"
          placeholder="Название услуги"
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
          id="id"
          name="id"
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-black/80"
          value={serviceId}
          hidden
        />
        <input
          type="text"
          id="description"
          name="description"
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-black/80"
          placeholder="Описание"
        />
        <input
          type="number"
          id="price"
          name="price"
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-black/80"
          placeholder="Стоимость"
        />
        <input
          type="file"
          id="photo"
          name="photo"
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-black/80"
          placeholder="Выберите файл"
        />
        <button
          type="submit"
          className="w-full bg-yellow-500 text-black py-2 rounded-md hover:bg-blue-600"
        >
          Изменить
        </button>
      </form>
    </div>
  );
}
