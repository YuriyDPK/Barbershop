"use client";
import React, { useState } from "react";
import DeleteService from "@/components/DeleteService";
import Image from "next/image";

interface Service {
  id: number;
  title: string;
  description: string;
  price: number;
  photo: string;
}

interface ServiceCardMoreProps {
  service: Service;
  role: string;
}

export default function ServiceCardMore({
  service,
  role,
}: ServiceCardMoreProps) {
  const [showFullDescription, setShowFullDescription] = useState(false);
  const charLimit = 20;

  const truncatedDescription =
    service.description.length > charLimit
      ? service.description.slice(0, charLimit) + "..."
      : service.description;

  const handleToggleDescription = () => {
    setShowFullDescription(!showFullDescription);
  };

  return (
    <div className="mb-10 border overflow-hidden rounded-lg bg-white shadow-lg transform transition duration-500 hover:scale-105 max-w-[500px] w-full mx-auto">
      <Image
        src={"/assets/" + service.photo}
        alt={service.title}
        className="w-full object-cover rounded-t-lg"
        width={500} // Укажите ширину изображения
        height={300} // Укажите высоту изображения
      />
      <div className="p-6">
        <h3 className="mb-4 text-2xl font-bold text-gray-800 hover:text-gray-600 break-words">
          Услуга: {service.title}
        </h3>
        <div className="mb-4 text-lg font-semibold text-gray-700">
          Цена: {service.price} руб.
        </div>
        <div className="mb-1 text-gray-600 break-words">
          Описание:{" "}
          {showFullDescription ? service.description : truncatedDescription}
        </div>
        {service.description.length > charLimit && (
          <button
            onClick={handleToggleDescription}
            className="mb-2 text-blue-500 hover:text-blue-700 focus:outline-none"
          >
            {showFullDescription ? "Скрыть" : "Подробнее"}
          </button>
        )}
        {role === "admin" && (
          <DeleteService serviceId={service.id.toString()} />
        )}
      </div>
    </div>
  );
}
