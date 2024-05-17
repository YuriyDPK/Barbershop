import SetDataUser from "@/components/SetDataUser";
import { cookies } from "next/headers";
import prisma from "@/lib/prisma"; // Импорт Prisma из lib/prisma
import { redirect } from "next/navigation";
import EditReview from "@/components/buttons/EditReview";
import DeleteAppointment from "@/components/buttons/DeleteAppointment";

export default async function Account() {
  const cookieStore = cookies();
  const email = cookieStore.get("email")?.value;
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    redirect("/login");
  }

  const reviews = await prisma.review.findMany({
    where: { userId: user.id },
    include: { service: true, user: true },
  });

  const appointments = await prisma.appointment.findMany({
    where: { userId: user.id },
    include: { service: true, user: true },
  });

  return (
    <div className="lg:w-1/2 mx-auto mt-6 p-8">
      <h1 className="text-center text-xl">Личный кабинет</h1>
      <SetDataUser />
      <div className="flex lg:flex-row flex-col justify-between gap-10">
        <div className="flex flex-col gap-2 w-full">
          <h1 className="text-xl text-center mt-2">Отзывы оставленные вами</h1>
          {reviews.length > 0 ? (
            reviews.map((review, i) => (
              <div key={i} className="mt-3">
                <div className="flex flex-col">
                  <div>
                    <b>Услуга:</b> {review.service.title}
                  </div>
                  <div>
                    <b>Клиент:</b> {review.user.username}
                  </div>
                  <div>
                    <b>Отзыв:</b> {review.content}
                  </div>
                  <div>
                    <b>Статус:</b> {review.status}
                  </div>
                  <div className="flex flex-col gap-1">
                    <EditReview
                      serviceId={review.service.id.toString()}
                      reviewId={review.id.toString()}
                    />
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center">Вы еще не оставили отзывов.</p>
          )}
        </div>

        <div className="flex flex-col gap-2 w-full">
          <h1 className="text-xl text-center mt-2">Заявки оставленные вами</h1>
          {appointments.length > 0 ? (
            appointments.map((appointment, i) => (
              <div key={i} className="mt-3">
                <div className="flex flex-col">
                  <div>
                    <b>Услуга:</b> {appointment.service.title}
                  </div>
                  <div>
                    <b>Клиент:</b> {appointment.user.username}
                  </div>
                  <div>
                    <b>Статус:</b> {appointment.status}
                  </div>
                  <div>
                    <b>Дата записи:</b>{" "}
                    {new Date(appointment.date).toLocaleString()}
                  </div>
                  <div className="flex flex-col gap-1">
                    <DeleteAppointment
                      serviceId={appointment.service.id.toString()}
                      appointmentId={appointment.id.toString()}
                    />
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center">У вас еще нет заявок.</p>
          )}
        </div>
      </div>
    </div>
  );
}
