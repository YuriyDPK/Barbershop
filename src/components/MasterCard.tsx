"use client";
import React, { useState } from "react";
import Image from "next/image";

interface MasterCardProps {
  name: string;
  image: string;
  bio: string;
  specialty: string;
}

const MasterCard: React.FC<MasterCardProps> = ({
  name,
  image,
  bio,
  specialty,
}) => {
  const [showFullBio, setShowFullBio] = useState(false);
  const wordLimit = 20;

  const truncatedBio =
    bio.split(" ").slice(0, wordLimit).join(" ") +
    (bio.split(" ").length > wordLimit ? "..." : "");

  const handleToggleBio = () => {
    setShowFullBio(!showFullBio);
  };

  return (
    <div className="max-w-sm mx-auto bg-white shadow-lg rounded-lg overflow-hidden transform transition-transform hover:scale-105">
      <Image
        className="w-full h-56 object-cover object-center"
        src={image}
        alt={name}
        width={400} // Укажите ширину
        height={224} // Укажите высоту
      />
      <div className="p-6">
        <h2 className="text-2xl font-bold text-gray-800">{name}</h2>
        <p className="mt-2 text-gray-600">{showFullBio ? bio : truncatedBio}</p>
        {bio.split(" ").length > wordLimit && (
          <button
            onClick={handleToggleBio}
            className="mt-2 text-blue-500 hover:text-blue-700 focus:outline-none"
          >
            {showFullBio ? "Скрыть" : "Подробнее"}
          </button>
        )}
        <p className="mt-2 text-gray-800 font-semibold">
          Специализация: {specialty}
        </p>
      </div>
    </div>
  );
};

export default MasterCard;
