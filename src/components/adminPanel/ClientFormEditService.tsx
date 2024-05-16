"use client";

import React, { useState } from "react";

interface ClientFormAddServiceProps {
  userId: string | null;
}

const ClientFormEditService: React.FC<ClientFormAddServiceProps> = ({
  userId,
  serviceId,
}) => {
  const [isFormVisible, setIsFormVisible] = useState(false);

  const toggleFormVisibility = () => {
    setIsFormVisible((prev) => !prev);
  };
  return (
    <div className="mt-4 flex justify-center flex-col">
      <button
        onClick={toggleFormVisibility}
        className="bg-yellow-400 text-white py-2 px-4 rounded-md hover:bg-yellow-500 m-2"
      >
        {isFormVisible ? "Скрыть форму" : "Редактировать услугу"}
      </button>
      {isFormVisible && (
        <form
          className="space-y-3"
          method="POST"
          action="/api/services/editService"
          encType="multipart/form-data"
        >
          <input
            type="text"
            id="title"
            name="title"
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-black/80"
            placeholder="Название услуги"
          />
          <input
            type="text"
            id="managerId"
            name="managerId"
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-black/80"
            value={userId}
            hidden
          />
          <input
            type="text"
            id="id"
            name="id"
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-black/80"
            value={serviceId}
            hidden
          />
          <input
            type="text"
            id="description"
            name="description"
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-black/80"
            placeholder="Описание"
          />
          <input
            type="number"
            id="price"
            name="price"
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-black/80"
            placeholder="Стоимость"
          />
          <input
            type="file"
            id="photo"
            name="photo"
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-black/80"
            placeholder="Выберите файл"
          />
          <button
            type="submit"
            className="w-full bg-yellow-500 text-black py-2 rounded-md hover:bg-blue-600"
          >
            Изменить
          </button>
        </form>
      )}
    </div>
  );
};

export default ClientFormEditService;
