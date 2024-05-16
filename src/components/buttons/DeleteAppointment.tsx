"use client";
import React, { useState } from "react";
import { useSearchParams, usePathname, useRouter } from "next/navigation";

export default function DeleteAppointment({
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
      <h2 className="text-xl font-semibold">Удалить заявку:</h2>

      <button
        onClick={handleSubmitDel}
        className="py-1 px-5 bg-red-300 rounded-sm mt-1"
      >
        Удалить
      </button>
    </div>
  );
}
