import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import FormAddService from "@/components/adminPanel/FormAddService";
import DeleteReview from "@/components/buttons/DeleteReview";
import ChangeStatusAppointment from "@/components/buttons/ChangeStatusAppointment";
import ChangeStatusReview from "@/components/buttons/ChangeStatusReview";
import prisma from "@/lib/prisma"; // Импорт Prisma из lib/prisma

export default async function Service() {
  const cookieStore = cookies();
  const email = cookieStore.get("email")?.value;
  const role = cookieStore.get("role")?.value;
  if (!email || role !== "admin") {
    redirect("/user/login");
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    redirect("/user/login");
  }

  const reviews = await prisma.review.findMany({
    include: { service: true, user: true },
  });

  const appointments = await prisma.appointment.findMany({
    include: { service: true, user: true },
  });

  return (
    <div className="p-4 lg:w-1/2 mx-auto ">
      <h2 className="text-2xl font-semibold mb-4 text-black text-center">
        Добавить товар
      </h2>
      <FormAddService />
      <div className="flex lg:flex-row flex-col justify-between gap-10">
        <div className="flex flex-col gap-2 w-full">
          <h1 className="text-xl text-center mt-2">Отзывы</h1>
          {reviews.length > 0 ? (
            reviews.map((review, i) => (
              <div key={i} className="mt-3">
                <div className="flex flex-col">
                  <div>
                    <b>Услуга:</b> {review.service?.title}
                  </div>
                  <div>
                    <b>Клиент:</b> {review.user?.username}
                  </div>
                  <div>
                    <b>Отзыв:</b> {review.content}
                  </div>
                  <div>
                    <b>Статус:</b> {review.status}
                  </div>
                  <div className="flex flex-col gap-1">
                    <ChangeStatusReview reviewId={review.id.toString()} />
                    <DeleteReview
                      serviceId={review.service.id.toString()}
                      reviewId={review.id.toString()}
                    />
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center">Отзывы отсутствуют</p>
          )}
        </div>
        <div className="flex flex-col gap-2  w-full">
          <h1 className="text-xl text-center mt-2">Заявки</h1>
          {appointments.length > 0 ? (
            appointments.map((appointment, i) => (
              <div key={i} className="mt-3">
                <div className="flex flex-col">
                  <div>
                    <b>Услуга:</b>{" "}
                    {appointment.service
                      ? appointment.service.title
                      : "Нет информации"}
                  </div>
                  <div>
                    <b>Клиент:</b> {appointment.user.username}
                  </div>
                  <div>
                    <b>Телефон:</b> {appointment.user.phone}
                  </div>
                  <div>
                    <b>Email:</b> {appointment.user.email}
                  </div>
                  <div>
                    <b>Статус:</b> {appointment.status}
                  </div>
                  <div>
                    <b>Дата записи:</b>{" "}
                    {new Date(appointment.date).toLocaleString()}
                  </div>
                  <div className="flex flex-col gap-1">
                    <ChangeStatusAppointment
                      serviceId={appointment.service.id.toString()}
                      appointmentId={appointment.id.toString()}
                    />
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center">Нет записей</div>
          )}
        </div>
      </div>
    </div>
  );
}
