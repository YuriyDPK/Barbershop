"use client";
import React, { useState } from "react";
import { useSearchParams, usePathname, useRouter } from "next/navigation";

export default function TakeReview({
  serviceId,
  canReview,
}: {
  serviceId: string;
  canReview: boolean;
}) {
  const [review, setReview] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const handleSubmit = () => {
    if (review.trim() !== "") {
      const params = new URLSearchParams(searchParams);
      if (review) {
        params.set("review", review);
      } else {
        params.delete("review");
      }
      replace(`${pathname}?${params.toString()}`);
      setReview("");
      setError(null);
    } else {
      setError("Введите отзыв");
    }
  };

  if (!canReview) {
    return (
      <div className="mt-8 flex flex-col">
        <h2 className="text-xl font-semibold">Оставить отзыв:</h2>
        <p className="text-red-500 mt-2">
          Вы должны иметь запись на услугу, чтобы оставить отзыв.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-8 flex flex-col">
      <h2 className="text-xl font-semibold">Оставить отзыв:</h2>
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
        className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Оставить отзыв
      </button>
    </div>
  );
}
