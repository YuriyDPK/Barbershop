"use client";
import React, { useState } from "react";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { revalidatePath } from "next/cache";
export default function TakeOrder({
  serviceId,
  reviewId,
}: {
  serviceId: string;
  reviewId: string;
}) {
  const router = useRouter();
  const [review, setReview] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const handleSubmit = () => {
    if (review.trim() !== "") {
      const params = new URLSearchParams(searchParams);
      if (review) {
        // -------------------
        params.set("editReview", review);
        params.set("reviewIdParam", reviewId);
      } else {
        params.delete("editReview");
        params.delete("reviewIdParam");
      }
      replace(`${pathname}?${params.toString()}`);
      revalidatePath("/", "page");
      // Сбросить выбранную дату после отправки
      setReview("");
      // Сбросить ошибку, если была отображена
      setError(null);
    } else {
      setError("Введите отзыв");
    }
  };
  const handleSubmitDel = () => {
    const params = new URLSearchParams(searchParams);
    if (reviewId) {
      // -------------------
      params.set("delReview", reviewId);
    } else {
      params.delete("delReview");
    }
    replace(`${pathname}?${params.toString()}`);
    revalidatePath("/user/account", "page");
    // Сбросить выбранную дату после отправки
    setReview("");
    // Сбросить ошибку, если была отображена
    setError(null);
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
