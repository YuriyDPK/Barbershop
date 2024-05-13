"use client";
import React, { useState } from "react";
import { useSearchParams, usePathname, useRouter } from "next/navigation";

export default function TakeOrder({
  serviceId,
  appointmentId,
}: {
  serviceId: string;
  appointmentId: string;
}) {
  const router = useRouter();
  const [appointment, setAppointment] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const handleSubmit = () => {
    if (appointment.trim() !== "") {
      const params = new URLSearchParams(searchParams);
      if (appointment) {
        // -------------------
        params.set("editAppoinemnt", appointment);
        params.set("appoinemntIdParam", appointmentId);
      } else {
        params.delete("editAppoinemnt");
        params.delete("appoinemntIdParam");
      }
      replace(`${pathname}?${params.toString()}`);

      // Сбросить выбранную дату после отправки
      setAppointment("");
      // Сбросить ошибку, если была отображена
      setError(null);
    } else {
      setError("Введите отзыв");
    }
  };
  const handleSubmitDel = () => {
    const params = new URLSearchParams(searchParams);
    if (appointmentId) {
      // -------------------
      params.set("delAppointment", appointmentId);
    } else {
      params.delete("delAppointment");
    }
    replace(`${pathname}?${params.toString()}`);
    // Сбросить выбранную дату после отправки
    setAppointment("");
    // Сбросить ошибку, если была отображена
    setError(null);
  };
  return (
    <div className="mt-1 flex flex-col">
      <h2 className="text-xl font-semibold">Статус заявки:</h2>

      <select
        name="appoinment"
        id="appoinment"
        onChange={(e) => setAppointment(e.target.value)}
        className="text-lg border p-1"
      >
        <option value="ожидание">ожидание</option>
        <option value="отклонено">отклонено</option>
        <option value="одобрено">одобрено</option>
      </select>
      {/* Скрытое поле с serviceId */}
      <input type="hidden" name="serviceId" value={serviceId} />
      {error && <p className="text-red-500 mt-2">{error}</p>}
      <button
        onClick={handleSubmit}
        className="py-1 px-5 bg-yellow-300 rounded-sm mt-1"
      >
        Изменить
      </button>
      <button
        onClick={handleSubmitDel}
        className="py-1 px-5 bg-red-300 rounded-sm mt-1"
      >
        Удалить
      </button>
    </div>
  );
}
