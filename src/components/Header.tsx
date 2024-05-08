import React from 'react'

type Props = {}

export default function Header({}: Props) {
  return (
    <div>
        <header className="bg-gray-600 text-white py-4">
            <div className="container mx-auto flex justify-between items-center px-4 lg:px-0">
                {/* Логотип или название сайта */}
                <div className="text-xl font-bold">TOPBEARD</div>
                
                {/* Блоки меню */}
                <nav className="hidden lg:flex space-x-4">
                <a href="#" className="hover:text-gray-300">Главная</a>
                <a href="#" className="hover:text-gray-300">Услуги</a>
                <a href="#" className="hover:text-gray-300">Галерея</a>
                <a href="#" className="hover:text-gray-300">Запись</a>
                <a href="#" className="hover:text-gray-300">Контакты</a>
                </nav>

                {/* Кнопки авторизации и регистрации */}
                <div className="hidden lg:flex space-x-4">
                <button className="px-4 py-2 bg-blue-100 text-black rounded hover:bg-blue-600">Вход</button>
                <button className="px-4 py-2 bg-green-100 text-black rounded hover:bg-green-600">Регистрация</button>
                </div>

                {/* Кнопка профиля */}
                <div className="lg:hidden">
                <button className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600">Profile</button>
                </div>

                {/* Иконка для мобильного меню (если необходимо) */}
                {/* <div className="lg:hidden">
                <button>Меню</button>
                </div> */}
            </div>
        </header>
    </div>
  )
}