"use client";
import React, { useState } from "react";

export default function BurgerMenu({
  role,
  isAuth,
}: {
  role: { value: string } | undefined;
  isAuth: boolean;
}) {
  const [stateMenu, setStateMenu] = useState(false);

  function handlerClick() {
    setStateMenu((prevState) => !prevState);
  }

  return (
    <div className="lg:hidden relative">
      <div
        className="flex flex-col gap-1 cursor-pointer"
        onClick={handlerClick}
      >
        <span
          className="w-6 h-0.5 bg-white transition-transform duration-300 transform-gpu"
          style={{
            transform: stateMenu
              ? "rotate(45deg) translate(4px, 4px)"
              : "rotate(0)",
          }}
        ></span>
        <span
          className="w-6 h-0.5 bg-white transition-opacity duration-300"
          style={{ opacity: stateMenu ? "0" : "1" }}
        ></span>
        <span
          className="w-6 h-0.5 bg-white transition-transform duration-300 transform-gpu"
          style={{
            transform: stateMenu
              ? "rotate(-45deg) translate(4px, -4px)"
              : "rotate(0)",
          }}
        ></span>
      </div>
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 transition-opacity duration-300 ${
          stateMenu ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={handlerClick}
      ></div>
      <div
        className={`fixed top-0 right-0 w-64 bg-white shadow-md h-full transition-transform duration-300 transform ${
          stateMenu ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col p-4 space-y-4">
          <a href="/" className="text-black hover:text-gray-700">
            Главная
          </a>
          <a href="/service" className="text-black hover:text-gray-700">
            Услуги
          </a>
          {!isAuth && (
            <>
              <a
                href="/user/login"
                className="px-4 py-2 bg-blue-100 text-black rounded hover:bg-blue-600"
              >
                Вход
              </a>
              <a
                href="/user/register"
                className="px-4 py-2 bg-green-100 text-black rounded hover:bg-green-600"
              >
                Регистрация
              </a>
            </>
          )}
          {isAuth && (
            <>
              <a
                href="/user/account"
                className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700"
              >
                Профиль
              </a>
              {role && role.value === "admin" && (
                <a
                  href="/adminPanel"
                  className="px-4 py-2 bg-yellow-700 text-white rounded hover:bg-yellow-800"
                >
                  Админ-панель
                </a>
              )}
              <form action="/api/users/logout" method="GET">
                <button
                  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                  type="submit"
                >
                  Выйти
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
