"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

interface ClientFormAddServiceProps {
  userId: string | null;
}

const ClientFormAddService: React.FC<ClientFormAddServiceProps> = ({
  userId,
}) => {
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();

  useEffect(() => {
    const errorParam = searchParams.get("error");
    if (errorParam) {
      setError(decodeURIComponent(errorParam));
    }
  }, [searchParams]);

  const toggleFormVisibility = () => {
    setIsFormVisible((prev) => !prev);
  };

  return (
    <div className="mt-4 flex justify-center flex-col">
      <button
        onClick={toggleFormVisibility}
        className="bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 m-2"
      >
        {isFormVisible ? "Скрыть форму" : "Добавить услугу"}
      </button>
      {error && <div className="text-red-500 text-center mb-4">{error}</div>}
      {isFormVisible && (
        <form
          className="space-y-3 mt-2"
          method="POST"
          action="/api/services/addService"
          encType="multipart/form-data"
        >
          <input
            type="text"
            id="title"
            name="title"
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-black/80"
            placeholder="Название услуги"
            required
          />
          <input
            type="text"
            id="managerId"
            name="managerId"
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-black/80"
            value={userId || ""}
            hidden
          />
          <input
            type="text"
            id="description"
            name="description"
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-black/80"
            placeholder="Описание"
            required
          />
          <input
            type="number"
            id="price"
            name="price"
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-black/80"
            placeholder="Стоимость"
            required
          />
          <input
            type="file"
            id="photo"
            name="photo"
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-black/80"
            placeholder="Выберите файл"
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600"
          >
            Добавить
          </button>
        </form>
      )}
    </div>
  );
};

export default ClientFormAddService;
