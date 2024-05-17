"use client";
import React, { useState } from "react";

interface ServiceCardProps {
  id: number;
  title: string;
  image: string;
  description: string;
  price: number;
}

const ServiceCard: React.FC<ServiceCardProps> = ({
  id,
  title,
  image,
  description,
  price,
}) => {
  const [showFullDescription, setShowFullDescription] = useState(false);
  const charLimit = 20;

  const truncatedDescription =
    description.length > charLimit
      ? description.slice(0, charLimit) + "..."
      : description;

  const handleToggleDescription = () => {
    setShowFullDescription(!showFullDescription);
  };

  return (
    <div className="w-full bg-white shadow-lg rounded-lg overflow-hidden transform transition-transform hover:scale-105 mx-auto  ">
      <img
        className="w-full h-48 object-cover object-center"
        src={image}
        alt={title}
      />
      <div className="p-6 text-left">
        <h2 className="text-2xl font-bold text-gray-800 break-words">
          Услуга: {title}
        </h2>
        <div className="mt-2 text-gray-600 break-words">
          {showFullDescription ? (
            <p> {description}</p>
          ) : (
            <p className="truncate-text">Описание: {truncatedDescription}</p>
          )}
        </div>
        {description.length > charLimit && (
          <button
            onClick={handleToggleDescription}
            className="mt-2 text-blue-500 hover:text-blue-700 focus:outline-none"
          >
            {showFullDescription ? "Скрыть" : "Подробнее"}
          </button>
        )}
        <p className="mt-2 text-gray-800 font-semibold">Цена: {price} руб.</p>
        <a
          href={`/service/${id}`}
          className="mt-4 inline-block rounded-lg border px-7 py-2 text-base font-medium text-body-color transition hover:border-primary bg-gray-200 hover:bg-gray-300 hover:text-black dark:border-dark-3 dark:text-dark-6"
        >
          Подробнее
        </a>
      </div>
    </div>
  );
};

export default ServiceCard;
