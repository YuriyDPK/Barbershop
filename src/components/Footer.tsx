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
              1
            </a>
            <a href="#" className="text-xl">
              2
            </a>
            <a href="#" className="text-xl">
              3
            </a>
            <a href="#" className="text-xl">
              4
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
