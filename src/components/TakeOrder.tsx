"use client";
import React, { useState, useEffect } from "react";
import { useSearchParams, usePathname, useRouter } from "next/navigation";

export default function TakeOrder({
  serviceId,
  bookedDates,
}: {
  serviceId: string;
  bookedDates: string[];
}) {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  useEffect(() => {
    console.log("bookedDates:", bookedDates); // for debugging
  }, [bookedDates]);

  const handleSubmit = () => {
    if (selectedDate && selectedTime) {
      const selectedDateTime = new Date(`${selectedDate}T${selectedTime}`);
      if (selectedDateTime > new Date()) {
        const isBooked = bookedDates.some(
          (date) => new Date(date).getTime() === selectedDateTime.getTime()
        );
        if (isBooked) {
          setError("Это время уже занято, выберите другое");
        } else {
          const params = new URLSearchParams(searchParams);
          const year = selectedDateTime.getFullYear();
          const month = (selectedDateTime.getMonth() + 1)
            .toString()
            .padStart(2, "0");
          const day = selectedDateTime.getDate().toString().padStart(2, "0");
          const hours = selectedDateTime.getHours().toString().padStart(2, "0");
          const minutes = selectedDateTime
            .getMinutes()
            .toString()
            .padStart(2, "0");

          const urlDateString = `${year}-${month}-${day}T${hours}:${minutes}`;
          params.set("date", urlDateString);

          replace(`${pathname}?${params.toString()}`);
          setSelectedDate(null);
          setSelectedTime(null);
          setError(null);
        }
      } else {
        setError("Выберите корректную дату и время");
      }
    } else {
      setError("Выберите дату и время");
    }
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDate(e.target.value);
    setSelectedTime(null);
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const time = e.target.value;
    const [hours, minutes] = time.split(":").map(Number);
    if (hours < 9 || hours > 21 || (hours === 21 && minutes > 0)) {
      setError("Выберите время между 09:00 и 21:00");
    } else {
      const selectedDateTime = new Date(`${selectedDate}T${time}`);
      const isBooked = bookedDates.some(
        (date) => new Date(date).getTime() === selectedDateTime.getTime()
      );
      if (isBooked) {
        setError("Это время уже занято, выберите другое");
      } else {
        setSelectedTime(time);
        setError(null);
      }
    }
  };

  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };

  const getMaxDate = () => {
    const today = new Date();
    const maxDate = new Date(today.setDate(today.getDate() + 14));
    return maxDate.toISOString().split("T")[0];
  };

  const generateTimeOptions = () => {
    const options = [];
    for (let hour = 9; hour <= 21; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        if (hour === 21 && minute > 0) break;
        const option = `${hour.toString().padStart(2, "0")}:${minute
          .toString()
          .padStart(2, "0")}`;
        options.push(option);
      }
    }
    return options;
  };

  return (
    <div className="mt-8 flex flex-col">
      <h2 className="text-xl font-semibold">Оставить заявку:</h2>
      <input
        type="date"
        value={selectedDate || ""}
        onChange={handleDateChange}
        className="w-full p-2 border rounded mt-2"
        placeholder="Выберите дату"
        min={getMinDate()}
        max={getMaxDate()}
      />
      {selectedDate && (
        <select
          value={selectedTime || ""}
          onChange={handleTimeChange}
          className="w-full p-2 border rounded mt-2"
        >
          <option value="" disabled>
            Выберите время
          </option>
          {generateTimeOptions().map((time) => (
            <option key={time} value={time}>
              {time}
            </option>
          ))}
        </select>
      )}
      <input type="hidden" name="serviceId" value={serviceId} />
      {error && <p className="text-red-500 mt-2">{error}</p>}
      <button
        onClick={handleSubmit}
        className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Отправить заявку
      </button>
    </div>
  );
}
