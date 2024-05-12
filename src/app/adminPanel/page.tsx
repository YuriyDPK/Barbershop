import { db } from "@/shared/db";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { cookies } from "next/headers";
import DeleteReview from "@/components/buttons/DeleteReview";
import { redirect } from "next/navigation";
import ChangeStatusAppointment from "@/components/buttons/ChangeStatusAppointment";
import FormAddService from "@/components/adminPanel/FormAddService";

export default async function Service({
  searchParams,
}: {
  searchParams?: {
    delReview?: string;
    editReview?: string;
    reviewIdParam?: number;
    editAppoinemnt?: string;
    appoinemntIdParam?: number;
  };
}) {
  const cookieStore = cookies();
  const role = cookieStore.get("role");
  const email = cookieStore.get("email")?.value;
  let reviews, appointments, userId, user;
  if (email !== null) {
    // Find the user by email to get their ID
    user = await db.user.findUnique({ where: { email } });
    userId = user?.id;

    reviews = await db.review.findMany({
      include: { service: true, user: true },
    });
    if (searchParams?.delReview) {
      const id = parseInt(searchParams.delReview);
      await db.review.delete({ where: { id } });
      redirect("/adminPanel");
    }

    // get appointment from database
    appointments = await db.appointment.findMany({
      include: { service: true, user: true },
    });
    if (searchParams?.editAppoinemnt) {
      const id = parseInt(searchParams.appoinemntIdParam);
      const editAppoinemnt = searchParams.editAppoinemnt;
      await db.appointment.update({
        where: { id },
        data: { status: editAppoinemnt },
      });
      redirect("/adminPanel");
    }
  } else {
    redirect("/user/login");
  }
  return (
    <div className="p-4 lg:w-1/3 mx-auto">
      <h2 className="text-2xl font-semibold mb-4 text-black text-center">
        Добавить товар
      </h2>
      <FormAddService />
      <div className="flex flex-col gap-2">
        <h1 className="text-xl text-center mt-2">Отзывы</h1>
        {/* Проверяем наличие отзывов и выводим соответствующее сообщение */}
        {reviews.length > 0 ? (
          reviews.map((review, i) => {
            return (
              <div key={i} className="mt-3">
                <div className="flex flex-col ">
                  <div>
                    <b>Услуга:</b> {review.service?.title}
                  </div>
                  <div>
                    <b>Клиент:</b> {review.user?.username}
                  </div>
                  <div>
                    <b>Отзыв:</b> {review.content}
                  </div>
                  <div className="flex flex-col gap-1">
                    <DeleteReview
                      serviceId={review.service.id}
                      reviewId={review.id}
                    />
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <p className="text-center">Отзывы отсутствуют</p>
        )}
      </div>
      <div className="flex flex-col gap-2">
        <h1 className="text-xl text-center mt-2">Заявки</h1>
        {appointments.length > 0 ? (
          appointments.map((appointment, i) => {
            return (
              <div key={i} className="mt-3">
                <div className="flex flex-col ">
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
                    <b>Отзыв:</b> {appointment.status}
                  </div>
                  <div className="flex flex-col gap-1">
                    <ChangeStatusAppointment
                      serviceId={appointment.service.id}
                      appointmentId={appointment.id}
                    />
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center">Нет записей</div>
        )}
      </div>
    </div>
  );
}
