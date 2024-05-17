"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function ChangeStatusAppointment({
  reviewId,
}: {
  reviewId: string;
}) {
  const router = useRouter();
  const [review, setReview] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (review.trim() !== "") {
      try {
        const response = await fetch(`/api/admin/review/editStatus`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ reviewId, status: review }),
        });
        if (!response.ok) {
          throw new Error("Failed to update appointment");
        }
        setReview("");
        setError(null);
        router.refresh(); // Обновить текущую страницу
      } catch (error) {
        setError("Ошибка при редактировании заявки");
      }
    } else {
      setError("Введите статус заявки");
    }
  };

  return (
    <div className="mt-1 flex flex-col">
      <h2 className="text-xl font-semibold">Статус заявки:</h2>
      <select
        name="status"
        id="status"
        onChange={(e) => setReview(e.target.value)}
        className="text-lg border p-1"
      >
        <option value="ожидание">ожидание</option>
        <option value="отклонено">отклонено</option>
        <option value="одобрено">одобрено</option>
      </select>
      <input type="hidden" name="reviewId" value={reviewId} />
      {error && <p className="text-red-500 mt-2">{error}</p>}
      <button
        onClick={handleSubmit}
        className="py-1 px-5 bg-yellow-300 rounded-sm mt-1"
      >
        Изменить
      </button>
    </div>
  );
}
