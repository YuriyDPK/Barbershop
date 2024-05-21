import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import FormAddService from "@/components/adminPanel/FormAddService";
import DeleteReview from "@/components/buttons/DeleteReview";
import ChangeStatusAppointment from "@/components/buttons/ChangeStatusAppointment";
import ChangeStatusReview from "@/components/buttons/ChangeStatusReview";
import prisma from "@/lib/prisma"; // Импорт Prisma из lib/prisma
import { useState } from "react";

const PAGE_SIZE = 3;

export default async function Service({
  searchParams,
}: {
  searchParams: { pageAppointments?: string; pageReviews?: string };
}) {
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

  const pageReviews = parseInt(searchParams.pageReviews) || 1;
  const pageAppointments = parseInt(searchParams.pageAppointments) || 1;

  const reviews = await prisma.review.findMany({
    skip: (pageReviews - 1) * PAGE_SIZE,
    take: PAGE_SIZE,
    include: { service: true, user: true },
  });

  const reviewsCount = await prisma.review.count();

  const appointments = await prisma.appointment.findMany({
    skip: (pageAppointments - 1) * PAGE_SIZE,
    take: PAGE_SIZE,
    include: { service: true, user: true },
  });

  const appointmentsCount = await prisma.appointment.count();

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
          <Pagination
            currentPage={pageReviews}
            totalCount={reviewsCount}
            pageSize={PAGE_SIZE}
            urlPath="/admin/service?pageReviews="
          />
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
          <Pagination
            currentPage={pageAppointments}
            totalCount={appointmentsCount}
            pageSize={PAGE_SIZE}
            urlPath="/adminPanel?pageAppointments="
          />
        </div>
      </div>
    </div>
  );
}

function Pagination({ currentPage, totalCount, pageSize, urlPath }) {
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
