"use client";
import React from "react";

export default function DeleteService({ serviceId }: { serviceId: string }) {
  const handleSubmitDel = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/services/delService?id=${serviceId}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        // Перезагрузка страницы после успешного удаления
        window.location.href = "/service";
      } else {
        // Обработка ошибок
        console.error("Error deleting service");
      }
    } catch (error) {
      console.error("Error deleting service:", error);
    }
  };

  return (
    <div className="flex mx-auto text-center justify-center">
      <button
        onClick={handleSubmitDel}
        className="py-2 px-5 bg-red-400 hover:bg-red-500 rounded-lg text-white"
      >
        Удалить услугу
      </button>
    </div>
  );
}
