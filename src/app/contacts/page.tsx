// app/contacts/page.tsx
import React from "react";
import ContactDetails from "./ContactDetails";
import YandexMap from "./YandexMap";

const ContactsPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-4xl font-bold mb-6">Контакты</h1>
      <ContactDetails />
      <YandexMap />
    </div>
  );
};

export default ContactsPage;
