import SetDataUser from "@/components/SetDataUser";
import { cookies } from "next/headers";
import { db } from "@/shared/db";
import { redirect } from "next/navigation";
import EditReview from "@/components/buttons/EditReview";
import DeleteAppointment from "@/components/buttons/DeleteAppointment";

export default async function Account({ searchParams }) {
  const cookieStore = cookies();
  const email = cookieStore.get("email")?.value;
  const user = await db.user.findUnique({ where: { email } });

  if (!user) {
    redirect("/login");
  }

  const reviews = await db.review.findMany({
    where: { userId: user.id },
    include: { service: true, user: true },
  });

  const appointments = await db.appointment.findMany({
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
                  <div className="flex flex-col gap-1">
                    <EditReview
                      serviceId={review.service.id}
                      reviewId={review.id}
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
                      serviceId={appointment.service.id}
                      appointmentId={appointment.id}
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
