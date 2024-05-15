"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function EditReview({
  serviceId,
  reviewId,
}: {
  serviceId: string;
  reviewId: string;
}) {
  const router = useRouter();
  const [review, setReview] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (review.trim() !== "") {
      try {
        const response = await fetch(`/api/review/edit`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ reviewId, content: review }),
        });
        if (!response.ok) {
          throw new Error("Failed to edit review");
        }
        setReview("");
        setError(null);
        router.refresh(); // Обновить текущую страницу
      } catch (error) {
        setError("Ошибка при редактировании отзыва");
      }
    } else {
      setError("Введите отзыв");
    }
  };

  const handleSubmitDel = async () => {
    try {
      const response = await fetch(`/api/review/delete`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ reviewId }),
      });
      if (!response.ok) {
        throw new Error("Failed to delete review");
      }
      setReview("");
      setError(null);
      router.refresh(); // Обновить текущую страницу
    } catch (error) {
      setError("Ошибка при удалении отзыва");
    }
  };

  return (
    <div className="mt-1 flex flex-col">
      <h2 className="text-xl font-semibold">Редактировать отзыв:</h2>
      <textarea
        value={review}
        onChange={(e) => setReview(e.target.value)}
        className="w-full p-2 border rounded mt-2"
        placeholder="Введите ваш отзыв"
      />
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
