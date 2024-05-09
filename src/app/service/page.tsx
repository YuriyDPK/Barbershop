import { db } from "@/shared/db";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { cookies } from "next/headers";

export default async function Service({
  searchParams,
}: {
  searchParams?: { page?: string };
}) {
  let page = searchParams?.page ? parseInt(searchParams?.page) : 1;
  const count = 4;
  const totalServices = await db.service.count();
  const maxPage = Math.ceil(totalServices / count);

  // Проверка на страницу 0 и коррекция
  if (page <= 0) {
    page = 1;
  }

  // Проверка на страницу, на которой нет записей, и коррекция
  if ((page - 1) * count >= totalServices) {
    page = maxPage > 0 ? maxPage : 1;
  }

  const services = await db.service.findMany({
    skip: (page - 1) * count,
    take: count,
  });

  const cookieStore = cookies();
  const role = cookieStore.get("role");
  return (
    <div className="p-4">
      <Link href="/addService" className="bg-blue-400 p-4 py-2 mb-2">
        Добавить товар
      </Link>
      <div className="grid grid-cols-6 gap-4">
        {services.map((service, i) => {
          return (
            <Link
              href={`/service/${service.id}`}
              key={i}
              className="p-2 rounded-lg border shadow"
            >
              <div>Название: {service.title}</div>
              <div>Цена: {service.price}</div>
              <div>Описание: {service.description}</div>
              <Image
                src={"/assets/" + service.photo}
                alt={""}
                width={200}
                height={200}
                className="w-full object-cover rounded-lg"
              />
            </Link>
          );
        })}
      </div>
      {/* Проверка на наличие предыдущей страницы */}
      <div className="flex gap-2">
        {page > 1 && <Link href={`?page=${page - 1}`}> Назад </Link>}
        <div className=" bg-blue-400 w-10 text-center rounded-xl">{page}</div>
        {/* Проверка на наличие следующей страницы */}
        {page < maxPage && <Link href={`?page=${page + 1}`}> Дальше </Link>}
      </div>
    </div>
  );
}
