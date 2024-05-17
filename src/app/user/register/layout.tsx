"use client";
import { Inter } from "next/font/google";
import "../../globals.css";
import { useState } from "react";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    phone: "",
  });

  const [errors, setErrors] = useState({
    username: "",
    email: "",
    password: "",
    phone: "",
    form: "", // Добавил ключ для ошибок формы
  });

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone: string) => {
    const phoneRegex = /^(?:\+7|8)\d{10}$/;
    return phoneRegex.test(phone);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    // Reset error messages when user starts typing
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "",
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const newErrors = {
      username: "",
      email: "",
      password: "",
      phone: "",
      form: "", // Добавил ключ для ошибок формы
    };

    if (!validateEmail(formData.email)) {
      newErrors.email = "Некорректный email адрес";
    }

    if (!validatePhone(formData.phone)) {
      newErrors.phone =
        "Некорректный номер телефона. Введите только цифры, от 10 до 15 символов.";
    }

    if (Object.values(newErrors).some((error) => error)) {
      setErrors(newErrors);
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/api/users/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        // Регистрация успешна, перенаправляем пользователя на страницу профиля
        window.location.href = "/user/account";
      } else {
        const errorText = await response.text();
        setErrors((prevErrors) => ({
          ...prevErrors,
          form: `Ошибка при регистрации: ${errorText}`,
        }));
      }
    } catch (error) {
      if (error instanceof Error) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          form: `Ошибка при отправке запроса: ${error.message}`,
        }));
      } else {
        setErrors((prevErrors) => ({
          ...prevErrors,
          form: "Произошла неизвестная ошибка",
        }));
      }
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-1/3">
        <h2 className="text-2xl font-semibold mb-4 text-black text-center">
          Регистрация
        </h2>
        {errors.form && (
          <div className="text-red-500 text-center mb-4">{errors.form}</div>
        )}
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-black/80"
            placeholder="Введите ваше имя пользователя"
            required
          />
          {errors.username && (
            <div className="text-red-500 text-sm">{errors.username}</div>
          )}
          <input
            type="phone"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-black/80"
            placeholder="Введите ваш телефон"
            required
          />
          {errors.phone && (
            <div className="text-red-500 text-sm">{errors.phone}</div>
          )}
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-black/80"
            placeholder="Введите ваш email"
            required
          />
          {errors.email && (
            <div className="text-red-500 text-sm">{errors.email}</div>
          )}
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-black/80"
            placeholder="Введите ваш пароль"
            required
          />
          {errors.password && (
            <div className="text-red-500 text-sm">{errors.password}</div>
          )}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600"
          >
            Зарегистрироваться
          </button>
        </form>
      </div>
    </div>
  );
}
