"use client";
import React from "react";
import { fetchSession } from "@/hooks/session";
import { FormEvent, useEffect, useState } from "react";

type Props = {};

export default function SetDataUser({}: Props) {
  const [userName, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [updated, setUpdated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isPending, setIsPending] = useState(false);
  useEffect(() => {
    const getSession = async () => {
      try {
        const session: any = await fetchSession();
        setUsername(session.username);
        setEmail(session.email);
      } catch (error) {
        alert("Ошибка при получении сесиии");
      } finally {
        setIsLoading(false);
      }
    };
    getSession();
  }, [updated]);

  const handleChangeUserData = async (e: FormEvent) => {
    e.preventDefault();
    setIsPending(true);
    try {
      await fetch("/api/users/changeUserData", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: userName,
          email: email,
          password: password,
        }),
      });
      alert("Данные изменены");

      setUpdated(!updated);
    } catch (error) {
      alert("Прроизошла ошибка");
    } finally {
      setIsPending(false);
    }
  };
  if (isLoading)
    return (
      <div className="flex justify-center items-center h-screen">
        <div>Загрузка...</div>
      </div>
    );
  return (
    <div>
      <form
        className="border rounded-lg max-w-[600px] w-full mx-auto p-4 shadow mt-4 flex flex-col gap-2"
        onSubmit={handleChangeUserData}
      >
        <input
          type="text"
          value={userName}
          onChange={(e) => setUsername(e.target.value)}
          className="border px-3 py-2 rounded-lg"
        />
        <input
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border px-3 py-2 rounded-lg"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border px-3 py-2 rounded-lg"
        />
        <button
          className="bg-blue-500 h-12 rounded-lg text-white font-semibold disabled:opacity-50"
          disabled={isPending}
        >
          {isPending ? "Загрузка..." : "Изменить"}
        </button>
      </form>
    </div>
  );
}
