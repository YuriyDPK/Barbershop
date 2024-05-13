"use client";
import React, { useState } from "react";

export default function BurgerMenu({
  role,
  isAuth,
}: {
  role: string;
  isAuth: string;
}) {
  const [stateMenu, setStateMenu] = useState("hidden");
  function handlerClick(event: MouseEvent) {
    stateMenu == "block" ? setStateMenu("hidden") : setStateMenu("block");
  }
  return (
    <div className="lg:hidden">
      <div className="lg:hidden flex flex-col gap-1" onClick={handlerClick}>
        {/* <button>Меню</button> */}
        <span className="w-5 h-0.5 bg-white"></span>
        <span className="w-5 h-0.5 bg-white"></span>
        <span className="w-5 h-0.5 bg-white"></span>
      </div>
      <div
        className={`${stateMenu} flex flex-col gap-1 lg:hidden`}
        onClick={handlerClick}
      >
        <a href="/">Главная</a>
        <a href="/service">Услуги</a>
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
              href="http://localhost:3000/user/account"
              className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700"
            >
              Профиль
            </a>
            {role.value == "admin" && (
              <>
                <a
                  href="http://localhost:3000/adminPanel"
                  className="px-4 py-2 bg-yellow-700 text-white rounded hover:bg-yellow-800"
                >
                  Админ-панель
                </a>
              </>
            )}
            <form action="http://localhost:3000/api/users/logout" method="GET">
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
  );
}
