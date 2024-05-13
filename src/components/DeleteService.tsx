"use client";
import React from "react";

export default function DeleteService({ serviceId }: { serviceId: string }) {
  const handleSubmitDel = () => {
    fetch(`http://localhost:3000/api/services/delService?id=${serviceId}`, {
      method: "DELETE",
    });
    window.location.href = "/service";
  };
  return (
    <div className="flex mx-auto text-center justify-center">
      <button
        onClick={handleSubmitDel}
        className="py-1 px-5 bg-red-400 rounded-sm mt-1 text-white rounded-md"
      >
        Удалить услугу
      </button>
    </div>
  );
}
