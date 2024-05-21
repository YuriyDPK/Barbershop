import SetDataUser from "@/components/SetDataUser";
import { cookies } from "next/headers";
import prisma from "@/lib/prisma"; // Импорт Prisma из lib/prisma
import { redirect } from "next/navigation";
import EditReview from "@/components/buttons/EditReview";
import DeleteAppointment from "@/components/buttons/DeleteAppointment";

const PAGE_SIZE = 3;

export default async function Account({
  searchParams,
}: {
  searchParams: { pageReviews?: string; pageAppointments?: string };
}) {
  const cookieStore = cookies();
  const email = cookieStore.get("email")?.value;
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    redirect("/login");
  }

  const pageReviews = parseInt(searchParams.pageReviews || "1", 3);
  const pageAppointments = parseInt(searchParams.pageAppointments || "1", 3);

  const reviews = await prisma.review.findMany({
    where: { userId: user.id },
    skip: (pageReviews - 1) * PAGE_SIZE,
    take: PAGE_SIZE,
    include: { service: true, user: true },
  });

  const reviewsCount = await prisma.review.count({
    where: { userId: user.id },
  });

  const appointments = await prisma.appointment.findMany({
    where: { userId: user.id },
    skip: (pageAppointments - 1) * PAGE_SIZE,
    take: PAGE_SIZE,
    include: { service: true, user: true },
  });

  const appointmentsCount = await prisma.appointment.count({
    where: { userId: user.id },
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
          <Pagination
            currentPage={pageReviews}
            totalCount={reviewsCount}
            pageSize={PAGE_SIZE}
            urlPath="/user/account?pageReviews="
            pageParam="pageReviews"
          />
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
          <Pagination
            currentPage={pageAppointments}
            totalCount={appointmentsCount}
            pageSize={PAGE_SIZE}
            urlPath="/user/account?pageAppointments="
            pageParam="pageAppointments"
          />
        </div>
      </div>
    </div>
  );
}

function Pagination({ currentPage, totalCount, pageSize, urlPath, pageParam }) {
  const totalPages = Math.ceil(totalCount / pageSize);

  return (
    <div className="flex justify-center mt-4">
      {Array.from({ length: totalPages }, (_, i) => (
        <a
          key={i}
          href={`${urlPath}${i + 1}`}
          className={`px-3 py-1 mx-1 border rounded ${
            i + 1 === currentPage ? "bg-gray-300" : "bg-white"
          }`}
        >
          {i + 1}
        </a>
      ))}
    </div>
  );
}
