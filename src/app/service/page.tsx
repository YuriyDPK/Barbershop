import { db } from "@/shared/db";
import Link from "next/link";
import React from "react";
import { cookies } from "next/headers";
import SearchService from "@/components/SearchService";
import ServiceCard from "@/components/ServiceCard";

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
      <div className="flex lg:flex-row flex-col justify-center items-center gap-2">
        <h3>Сортировать по: </h3>
        <Link
          href={`?page=${page}&sortBy=price`}
          className="bg-blue-100 hover:bg-blue-200 p-2 rounded-md"
        >
          цене
        </Link>
        <Link
          href={`?page=${page}&sortBy=title`}
          className="bg-blue-100 hover:bg-blue-200 p-2 rounded-md"
        >
          названию
        </Link>
        <SearchService />
      </div>
      <div className="bg-gray-2 pb-10 pt-20 dark:bg-dark lg:pb-20 lg:pt-[120px] flex justify-center">
        <div className="container">
          {services.length > 0 ? (
            <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4 justify-center text-left align-middle">
              {services.map((service, i) => (
                <ServiceCard
                  key={i}
                  id={service.id}
                  title={service.title}
                  image={"/assets/" + service.photo}
                  description={service.description}
                  price={service.price}
                />
              ))}
            </div>
          ) : (
            <div className="text-center text-xl mt-20">Нет доступных услуг</div>
          )}
        </div>
      </div>

      {/* Проверка на наличие предыдущей страницы */}
      <div className="flex gap-2 justify-center mt-5">
        {page > 1 && (
          <Link
            href={`?page=${page - 1}`}
            className="flex items-center justify-center px-4 h-10 ms-0 text-black bg-white rounded-lg hover:bg-gray-100 dark:bg-blue-300 dark:text-black dark:hover:bg-blue-400 dark:hover:text-white"
          >
            <span className="sr-only">Previous</span>
            <svg
              className="w-3 h-3 rtl:rotate-180"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 6 10"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 1 1 5l4 4"
              />
            </svg>
          </Link>
        )}
        <div className="flex items-center justify-center px-4 h-10 ms-0 text-black bg-blue-200 rounded-lg hover:bg-blue-300 dark:bg-blue-300 dark:text-black dark:hover:bg-blue-400 dark:hover:text-white">
          {page}
        </div>
        {/* Проверка на наличие следующей страницы */}
        {page < maxPage && (
          <Link
            href={`?page=${page + 1}`}
            className="flex items-center justify-center px-4 h-10 ms-0 leading-tight text-black bg-blue-300 rounded-lg hover:bg-blue-400 hover:text-black dark:bg-blue-100 dark:text-gray-800 dark:hover:bg-blue-400 dark:hover:text-white"
          >
            <span className="sr-only">Next</span>
            <svg
              className="w-3 h-3 rtl:rotate-180"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 6 10"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m1 9 4-4-4-4"
              />
            </svg>
          </Link>
        )}
      </div>
    </div>
  );
}
