"use client";
import "../../globals.css";
import { FormEvent, useState } from "react";

export default function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:3000/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        window.location.href = "/user/account";
      } else {
        console.error("Login Error:", response.statusText);
      }
    } catch (error) {
      console.error("Error Sending Request:", error);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg lg:w-1/3">
        <h2 className="text-2xl font-semibold mb-4 text-black text-center">
          Авторизация
        </h2>
        <form onSubmit={handleSubmit} className="space-y-3">
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
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600"
          >
            Войти
          </button>
        </form>
      </div>
    </div>
  );
}
