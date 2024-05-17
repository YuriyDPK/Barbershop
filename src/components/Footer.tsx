"use client";
import React from "react";
import Image from "next/image";

type Props = {};

export default function Footer({}: Props) {
  return (
    <div>
      <footer className="bg-gray-500 text-white py-4 flex flex-col px-4">
        <div className="container mx-auto flex flex-col lg:flex-row justify-between items-center px-4 lg:px-0">
          {/* Контактная информация */}
          <div className="text-sm mb-4 lg:mb-0 lg:mr-8">
            <p className="mb-2">Address: 123 Street Name, City, Country</p>
            <p className="mb-2">Email: example@example.com</p>
            <p>Phone: +1234567890</p>
          </div>

          {/* Иконки социальных сетей */}
          <div className="flex space-x-4">
            <a href="#" className="text-xl">
              <Image
                src="/photos/tg.svg"
                alt="Telegram"
                className="w-10"
                width={40}
                height={40}
              />
            </a>
            <a href="#" className="text-xl">
              <Image
                src="/photos/vk.svg"
                alt="VKontakte"
                className="w-10"
                width={40}
                height={40}
              />
            </a>
            <a href="#" className="text-xl">
              <Image
                src="/photos/whatsup.svg"
                alt="WhatsApp"
                className="w-10"
                width={40}
                height={40}
              />
            </a>
            <a href="#" className="text-xl w-10">
              <Image
                src="/photos/youtube.svg"
                alt="YouTube"
                className="w-10"
                width={40}
                height={40}
              />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
