// app/contacts/ContactDetails.tsx
import React from "react";

const ContactDetails = () => {
  return (
    <div className="w-full max-w-2xl bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-2xl font-semibold mb-4">Свяжитесь с нами</h2>
      <p className="mb-4">Вы можете найти нас по адресу:</p>
      <p className="text-lg font-medium mb-6">Москва, ул. Примерная, д. 1</p>
      <p className="mb-4">Или позвонить нам:</p>
      <p className="text-lg font-medium mb-6">+7 (123) 456-78-90</p>
      <p className="mb-4">Также вы можете написать нам на почту:</p>
      <p className="text-lg font-medium">example@example.com</p>
    </div>
  );
};

export default ContactDetails;
