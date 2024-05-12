import SetDataUser from "@/components/SetDataUser";
import { cookies } from "next/headers";
import { db } from "@/shared/db";
import { redirect } from "next/navigation";
import Link from "next/link";
import EditReview from "@/components/buttons/EditReview";

export default async function Account({
  searchParams,
}: {
  searchParams?: {
    delReview?: string;
    editReview: string;
    reviewIdParam: number;
  };
}) {
  const cookieStore = cookies();
  const email = cookieStore.get("email").value;
  const user = db.user.findUnique({ where: { email } });
  if (!user) {
    redirect("/login");
  }
  // query in db (Prisma) to get reviews include service

  const reviews = await db.review.findMany({
    where: {
      userId: user.id,
    },
    include: { service: true, user: true },
  });

  if (searchParams?.delReview) {
    const id = parseInt(searchParams.delReview);
    await db.review.delete({ where: { id } });
    redirect("/user/account");
  }
  if (searchParams?.editReview) {
    const reviewIdParam = parseInt(searchParams.reviewIdParam);
    // update the review content

    const review = await db.review.update({
      where: {
        id: reviewIdParam,
      },
      data: {
        content: searchParams?.editReview,
      },
    });
    redirect("/user/account");
  }

  return (
    <div className="w-1/2 mx-auto mt-6">
      <h1 className="text-center text-xl">Личный кабинет</h1>
      <SetDataUser />

      <div className="flex flex-col gap-2">
        <h1 className="text-xl text-center mt-2">Отзывы оставленные вами</h1>
        {reviews.map((review, i) => {
          return (
            <div key={i} className="mt-3">
              <div className="flex flex-col ">
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
          );
        })}
      </div>
    </div>
  );
}
