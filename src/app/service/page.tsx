import { db } from "@/shared/db";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { cookies } from "next/headers";
import SearchService from "@/components/SearchService";

export default async function Service({
  searchParams,
}: {
  searchParams?: { page?: string; sortBy?: string; name?: string };
}) {
  let page = searchParams?.page ? parseInt(searchParams?.page) : 1;
  let sortBy = searchParams?.sortBy || "price";
  let name = searchParams?.name ? String(searchParams?.name) : "";

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
    orderBy: { [sortBy]: "asc" },
    where: {
      title: {
        contains: name, // Поиск совпадений в поле title по переданному имени
      },
    },
  });
  const cookieStore = cookies();
  const role = cookieStore.get("role");
  return (
    <div className="p-4 mb-5 mx-auto">
      <div className="flex justify-center items-center gap-2">
        <h3>Сортировать по: </h3>
        {
          <Link
            href={`?page=${page}&sortBy=price`}
            className="bg-blue-100 p-1 rounded-md"
          >
            цене
          </Link>
        }
        {
          <Link
            href={`?page=${page}&sortBy=title`}
            className="bg-blue-100 p-1 rounded-md"
          >
            названию
          </Link>
        }
        <SearchService />
      </div>
      <div className="flex gap-4 mt-5 justify-center">
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
      <div className="flex gap-2 justify-center mt-5">
        {page > 1 && <Link href={`?page=${page - 1}`}> Назад </Link>}
        <div className=" bg-blue-400 w-10 text-center rounded-xl">{page}</div>
        {/* Проверка на наличие следующей страницы */}
        {page < maxPage && <Link href={`?page=${page + 1}`}> Дальше </Link>}
      </div>
    </div>
  );
}
