"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function DeleteReview({
  serviceId,
  reviewId,
}: {
  serviceId: string;
  reviewId: string;
}) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const handleSubmitDel = async () => {
    try {
      const response = await fetch(`/api/admin/review/delete`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ reviewId }),
      });
      if (!response.ok) {
        throw new Error("Failed to delete review");
      }
      setError(null);
      router.refresh(); // Обновить текущую страницу
    } catch (error) {
      setError("Ошибка при удалении отзыва");
    }
  };

  return (
    <div className="mt-1 flex flex-col">
      <h2 className="text-xl font-semibold">Удалить отзыв:</h2>
      {error && <p className="text-red-500 mt-2">{error}</p>}
      <button
        onClick={handleSubmitDel}
        className="py-1 px-5 bg-red-300 rounded-sm mt-1"
      >
        Удалить
      </button>
    </div>
  );
}
