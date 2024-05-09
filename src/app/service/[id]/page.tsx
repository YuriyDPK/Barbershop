import { db } from "@/shared/db";
import Image from "next/image";

export default async function Service({ params }: { params: { id: string } }) {
  const service = await db.service.findUnique({ where: { id: +params.id } });
  if (!service) return <div>Сервис не найден</div>;
  return (
    <div>
      <div className="p-2 rounded-lg border shadow max-w-[400px] w-full mx-auto mt-24">
        <div>Название: {service.title}</div>
        <div>Цена: {service.price}</div>
        <div>Описание: {service.description}</div>
        <Image
          src={"/assets/" + service.photo}
          alt={""}
          width={200}
          height={200}
          className="w-full object-cover rounded-lg"
        />
      </div>
    </div>
  );
}
