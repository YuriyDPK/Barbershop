"use client";
import React, { useState } from "react";
import { useSearchParams, usePathname, useRouter } from "next/navigation";

export default function TakeOrder({ serviceId }: { serviceId: string }) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const handleSubmit = () => {
    if (selectedDate && selectedDate > new Date()) {
      const params = new URLSearchParams(searchParams);
      if (selectedDate) {
        // console.log(String(selectedDate));
        let year = selectedDate.getFullYear();
        let month = (selectedDate.getMonth() + 1).toString().padStart(2, "0"); // +1, так как месяцы в JavaScript начинаются с 0
        let day = selectedDate.getDate().toString().padStart(2, "0");

        // Получить часы, минуты и секунды
        let hours = selectedDate.getHours().toString().padStart(2, "0");
        let minutes = selectedDate.getMinutes().toString().padStart(2, "0");
        let seconds = selectedDate.getSeconds().toString().padStart(2, "0");

        // Формирование строки для передачи в параметрах URL
        let urlDateString = `${year}.${month}.${day}T${hours}.${minutes}.${seconds}`;
        console.log(urlDateString); // Вывод строки в формате YYYY-MM-DDTHH:MM:SS

        // -------------------
        params.set("date", urlDateString);
      } else {
        params.delete("date");
      }
      replace(`${pathname}?${params.toString()}`);
      // Сбросить выбранную дату после отправки
      setSelectedDate(null);
      // Сбросить ошибку, если была отображена
      setError(null);
    } else {
      setError("Выберите корректную дату и время");
    }
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedDateTime = new Date(e.target.value);
    if (selectedDateTime <= new Date()) {
      setError("Выберите дату и время, которые еще не прошли");
    } else {
      setError(null);
      setSelectedDate(selectedDateTime);
    }
  };

  return (
    <div className="mt-8 flex flex-col">
      <h2 className="text-xl font-semibold">Оставить заявку:</h2>
      <input
        type="datetime-local"
        value={selectedDate ? selectedDate.toISOString().slice(0, -8) : ""}
        onChange={handleDateChange}
        className="w-full p-2 border rounded mt-2"
        placeholder="Выберите дату и время"
      />
      {/* Скрытое поле с serviceId */}
      <input type="hidden" name="serviceId" value={serviceId} />
      {error && <p className="text-red-500 mt-2">{error}</p>}
      <button
        onClick={handleSubmit}
        className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Отправить заявку
      </button>
    </div>
  );
}
