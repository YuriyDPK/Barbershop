import React from "react";
import { useUser } from "@/hooks/useUser";
import ClientFormAddService from "./clientFormAddService";

export default async function FormAddService() {
  const { userId } = await useUser();

  const formattedUserId = userId !== undefined ? userId.toString() : null;

  return (
    <div className="flex justify-center">
      <ClientFormAddService userId={formattedUserId} />
    </div>
  );
}
