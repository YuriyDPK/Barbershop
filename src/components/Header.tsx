import React from "react";
import { cookies } from "next/headers"; // добавляем этот импорт
import Link from "next/link";
const links = [
  {
    name: "Главная",
    url: "/",
  },
  {
    name: "Услуги",
    url: "/service",
  },
];

export function Header() {
  // Получаем email пользователя из кук
  const isAuth = cookies().get("email");
  const isAdmin = cookies().get("role");

  return (
    <div>
      <header className="bg-gray-600 text-white py-4">
        <div className="container mx-auto flex justify-between items-center px-4 lg:px-0">
          {/* Логотип или название сайта */}
          <div className="text-xl font-bold">TOPBEARD</div>

          {/* Блоки меню */}
          <nav className="hidden lg:flex space-x-4">
            {links.map((link, i) => {
              return (
                <Link href={link.url} key={i} className="hover:text-gray-300">
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Кнопки авторизации и регистрации */}
          {!isAuth && (
            <div className="hidden lg:flex space-x-4">
              <Link
                href="/user/login"
                className="px-4 py-2 bg-blue-100 text-black rounded hover:bg-blue-600"
              >
                Вход
              </Link>
              <Link
                href="/user/register"
                className="px-4 py-2 bg-green-100 text-black rounded hover:bg-green-600"
              >
                Регистрация
              </Link>
            </div>
          )}

          {/* Кнопка профиля и выхода */}
          {isAuth && (
            <div className="hidden lg:flex space-x-4">
              <Link
                href="http://localhost:3000/user/account"
                className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700"
              >
                Профиль
              </Link>
              {isAdmin && isAdmin.value === "admin" && (
                <Link
                  href="http://localhost:3000/adminPanel"
                  className="px-4 py-2 bg-yellow-700 text-white rounded hover:bg-yellow-800"
                >
                  Админ-панель
                </Link>
              )}
              <form
                action="http://localhost:3000/api/users/logout"
                method="GET"
              >
                <button
                  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                  type="submit"
                >
                  Выйти
                </button>
              </form>
            </div>
          )}

          {/* Кнопка профиля для мобильного меню */}
          <div className="lg:hidden">
            {/* <button className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600">Профиль</button>
            <button className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">Выйти</button> */}
          </div>

          {/* Иконка для мобильного меню (если необходимо) */}
          <div className="lg:hidden">
            <button>Меню</button>
          </div>
        </div>
      </header>
    </div>
  );
}