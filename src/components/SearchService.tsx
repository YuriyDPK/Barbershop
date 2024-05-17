"use client";
import React, { useEffect, useState } from "react";
import { useSearchParams, usePathname, useRouter } from "next/navigation";

export default function SearchService() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const [name, setName] = useState<string>("");

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  // Обработчик изменения значения в поле ввода
  useEffect(() => {
    console.log(name);

    const params = new URLSearchParams(searchParams);
    if (name) {
      params.set("name", name);
    } else {
      params.delete("name");
    }
    replace(`${pathname}?${params.toString()}`);
  }, [name, pathname, replace, searchParams]);

  return (
    <div>
      <input
        className="py-1 px-3 border"
        type="text"
        placeholder="Поиск по названию"
        onChange={handleNameChange}
        value={name}
      />
    </div>
  );
}
