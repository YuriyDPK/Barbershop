"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function ChangeStatusAppointment({
  serviceId,
  appointmentId,
}: {
  serviceId: string;
  appointmentId: string;
}) {
  const router = useRouter();
  const [appointment, setAppointment] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (appointment.trim() !== "") {
      try {
        const response = await fetch(`/api/admin/appointment/edit`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ appointmentId, status: appointment }),
        });
        if (!response.ok) {
          throw new Error("Failed to update appointment");
        }
        setAppointment("");
        setError(null);
        router.refresh(); // Обновить текущую страницу
      } catch (error) {
        setError("Ошибка при редактировании заявки");
      }
    } else {
      setError("Введите статус заявки");
    }
  };

  const handleSubmitDel = async () => {
    try {
      const response = await fetch(`/api/admin/appointment/delete`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ appointmentId }),
      });
      if (!response.ok) {
        throw new Error("Failed to delete appointment");
      }
      setAppointment("");
      setError(null);
      router.refresh(); // Обновить текущую страницу
    } catch (error) {
      setError("Ошибка при удалении заявки");
    }
  };

  return (
    <div className="mt-1 flex flex-col">
      <h2 className="text-xl font-semibold">Статус заявки:</h2>
      <select
        name="appointment"
        id="appointment"
        onChange={(e) => setAppointment(e.target.value)}
        className="text-lg border p-1"
      >
        <option value="ожидание">ожидание</option>
        <option value="отклонено">отклонено</option>
        <option value="одобрено">одобрено</option>
      </select>
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
