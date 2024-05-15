"use client"; // Это клиентский компонент

import React, { useEffect } from "react";

const GoogleMap = () => {
  useEffect(() => {
    const initializeMap = () => {
      const mapElement = document.getElementById("map");

      if (!mapElement) return;

      const map = new (window as any).google.maps.Map(mapElement, {
        center: { lat: 55.751574, lng: 37.573856 }, // Центр карты (Москва)
        zoom: 10,
      });

      new (window as any).google.maps.Marker({
        position: { lat: 55.751574, lng: 37.573856 },
        map,
        title: "Наш офис",
      });
    };

    // Проверка наличия скрипта и загрузка Google Maps API
    if (!(window as any).google) {
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?callback=initMap`; // Замените ВАШ_API_КЛЮЧ на ваш реальный API ключ
      script.async = true;
      (window as any).initMap = initializeMap;
      document.head.appendChild(script);
    } else {
      initializeMap();
    }
  }, []);

  return (
    <div
      id="map"
      className="w-full max-w-2xl h-64 bg-gray-200 rounded-lg shadow-md"
    ></div>
  );
};

export default GoogleMap;
