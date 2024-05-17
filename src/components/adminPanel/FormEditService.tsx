import React from "react";
import { useUser } from "@/hooks/useUser";
import ClientFormEditService from "./ClientFormEditService";
export default async function FormEditService({
  serviceId,
}: {
  serviceId: string;
}) {
  const { userId, email, role } = await useUser();
  const formattedUserId = userId !== undefined ? userId.toString() : null;

  return (
    <div className=" mt-2">
      <h1>Редактировать услугу</h1>
      <ClientFormEditService userId={formattedUserId} serviceId={serviceId} />
    </div>
  );
}
