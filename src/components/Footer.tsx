"use client";
import React from "react";

type Props = {};

export default function Footer({}: Props) {
  return (
    <div>
      <footer className="bg-gray-500 text-white py-4 flex flex-col max-h-24">
        <div className="container mx-auto flex justify-between items-center px-4 lg:px-0">
          {/* Иконки социальных сетей */}
          <div className="flex space-x-4">
            <a href="#" className="text-xl">
              <img src="../../photos/tg.svg" alt="" />
            </a>
            <a href="#" className="text-xl">
              <img src="../../photos/vk.svg" alt="" />
            </a>
            <a href="#" className="text-xl">
              <img src="../../photos/whatsup.svg" alt="" />
            </a>
            <a href="#" className="text-xl">
              <img src="../../photos/youtube.svg" alt="" />
            </a>
          </div>

          {/* Контактная информация */}
          <div className="text-sm">
            <p>Address: 123 Street Name, City, Country</p>
            <p>Email: example@example.com</p>
            <p>Phone: +1234567890</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
