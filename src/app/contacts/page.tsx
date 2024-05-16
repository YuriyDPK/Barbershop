// app/contacts/page.tsx
import React from "react";
import ContactDetails from "./ContactDetails";

const ContactsPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-4xl font-bold mb-6">Контакты</h1>
      <ContactDetails />
      {/* <YandexMap /> */}
      <iframe
        src="https://yandex.ru/map-widget/v1/?um=constructor%3A0d93995d25adaca387963802ece8ed31ce4942affa0c3c8839aec2ea78fc7be5&amp;source=constructor"
        width="800"
        height="400"
        frameBorder="0"
      ></iframe>
    </div>
  );
};

export default ContactsPage;
