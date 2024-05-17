import TakeOrder from "@/components/TakeOrder";
import { db } from "@/shared/db";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import TakeReview from "@/components/TakeReview";
import FormEditService from "@/components/adminPanel/FormEditService";
import ServiceCardMore from "@/components/ServiceCardMore";

export default async function Service({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { date: string; review: string; status: string };
}) {
  const cookieStore = cookies();
  const role = cookieStore.get("role")?.value;
  const email = cookieStore.get("email")?.value;
  let user, userId;
  if (email != null) {
    user = await db.user.findUnique({ where: { email } });
    userId = user?.id;
  }

  let date = searchParams?.date ? String(searchParams?.date) : "";
  let dateObject = null;
  if (date) {
    const [datePart, timePart] = date.split("T");

    if (datePart && timePart) {
      const isoString = `${datePart}T${timePart.replace(/\./g, ":")}`;
      dateObject = new Date(isoString);

      if (userId === undefined) {
        throw new Error("userId is undefined");
      }
      await db.appointment.create({
        data: {
          date: dateObject,
          userId,
          serviceId: +params.id,
          status: "ожидание",
        },
      });
      redirect("../user/account");
    }
  }

  let reviewParam = searchParams?.review ? String(searchParams?.review) : "";
  let statusParam = searchParams?.status ? String(searchParams?.status) : "";
  if (reviewParam.length > 1 && statusParam === "ожидание") {
    if (userId === undefined) {
      throw new Error("userId is undefined");
    }

    const hasAppointment = await db.appointment.findFirst({
      where: {
        userId,
        serviceId: +params.id,
      },
    });

    if (!hasAppointment) {
      throw new Error("Вы должны иметь запись чтобы оставить отзыв");
    }

    await db.review.create({
      data: {
        content: reviewParam,
        userId,
        status: "ожидание",
        serviceId: +params.id,
      },
    });
    reviewParam = "";
    statusParam = "";
    redirect("/service");
  }

  const reviews = await db.review.findMany({
    where: { serviceId: +params.id, status: "одобрено" },
    include: { user: true },
  });

  const service = await db.service.findUnique({ where: { id: +params.id } });
  if (!service) return <div>Сервис не найден</div>;

  const hasAppointment = userId
    ? await db.appointment.findFirst({
        where: {
          userId,
          serviceId: +params.id,
        },
      })
    : null;

  const appointments = await db.appointment.findMany({
    where: { serviceId: +params.id },
    select: { date: true },
  });
  const bookedDates = appointments.map((appointment) =>
    appointment.date.toISOString()
  );

  return (
    <div className="lg:w-1/2 mx-auto p-8">
      <div className="w-full flex flex-col-reverse ">
        {role == "admin" ? (
          <FormEditService serviceId={service.id} />
        ) : (
          <div></div>
        )}

        <ServiceCardMore service={service} role={role} />
      </div>

      {email != null ? (
        <>
          <TakeOrder serviceId={params.id} bookedDates={bookedDates} />
          <TakeReview serviceId={params.id} canReview={!!hasAppointment} />
        </>
      ) : (
        <div></div>
      )}

      <div className="flex flex-col mt-10">
        <h2 className="text-2xl font-bold mb-5">Отзывы:</h2>
        {reviews.length > 0 ? (
          reviews.map((review, i) => (
            <div
              key={i}
              className="mb-4 p-4 border rounded-lg bg-gray-50 shadow-md"
            >
              <div className="text-gray-700 font-semibold mb-2">
                Клиент: {review.user.username}
              </div>
              <div className="text-gray-600">{review.content}</div>
            </div>
          ))
        ) : (
          <div className="text-gray-600">Отзывов пока нет.</div>
        )}
      </div>
    </div>
  );
}
