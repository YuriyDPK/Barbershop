"use client";
import React, { useState } from "react";
import { useSearchParams, usePathname, useRouter } from "next/navigation";

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

  const handleSubmitDel = () => {
    const params = new URLSearchParams(searchParams);
    if (reviewId) {
      // -------------------
      params.set("delReview", reviewId);
    } else {
      params.delete("delReview");
    }
    replace(`${pathname}?${params.toString()}`);
    // Сбросить выбранную дату после отправки
    setReview("");
    // Сбросить ошибку, если была отображена
    setError(null);
  };
  return (
    <div className="mt-1 flex flex-col">
      <h2 className="text-xl font-semibold">Удалить отзыв:</h2>

      <button
        onClick={handleSubmitDel}
        className="py-1 px-5 bg-red-300 rounded-sm mt-1"
      >
        Удалить
      </button>
    </div>
  );
}
