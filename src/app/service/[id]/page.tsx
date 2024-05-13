import TakeOrder from "@/components/TakeOrder";
import { db } from "@/shared/db";
import Image from "next/image";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import TakeReview from "@/components/TakeReview";
import DeleteService from "@/components/DeleteService";
import FormEditService from "@/components/adminPanel/FormEditService";

export default async function Service({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { date: string; review: string };
}) {
  // получаем data пользователя
  const cookieStore = cookies();
  const role = cookieStore.get("role")?.value;
  const email = cookieStore.get("email")?.value;
  let user, userId;
  if (email != null) {
    // Find the user by email to get their ID
    user = await db.user.findUnique({ where: { email } });
    userId = user?.id;
  }

  //работа с датой
  let date = searchParams?.date ? String(searchParams?.date) : "";
  let dateObject = null;
  if (date != null) {
    // console.log(date);
    // Проверяем наличие символа "T" в строке
    const splitChar = date.includes("T") ? "T" : " ";

    // Разбиваем строку по символу "T" или пробелу
    const [datePart, timePart] = date.split(splitChar);

    // Если datePart и timePart существуют, заменяем точки на дефисы и преобразуем строку в формат ISO
    if (datePart && timePart) {
      const isoString = `${datePart.replace(/\./g, "-")}T${timePart.replace(
        /\./g,
        ":"
      )}`;
      // Преобразуем строку в объект даты
      dateObject = new Date(isoString);
      // console.log(dateObject);
      // create an appoinment in prisma
      const appointment = await db.appointment.create({
        data: {
          date: dateObject,
          userId,
          serviceId: +params.id,
          status: "ожидание",
        },
      });
      // redirect to account
      redirect("../user/account");
    }
  }
  // get a review from params
  let reviewParam = searchParams?.review ? String(searchParams?.review) : "";
  // create an review in prisma if review is not null
  if (reviewParam.length > 1) {
    const review = await db.review.create({
      data: {
        content: reviewParam,
        userId,
        serviceId: +params.id,
      },
    });
    reviewParam = "";
    // redirect to account
    redirect("/service");
  }

  // get all rewiews with relate table users that show who create this review
  const reviews = await db.review.findMany({
    where: { serviceId: +params.id },
    include: { user: true },
  });

  const service = await db.service.findUnique({ where: { id: +params.id } });
  if (!service) return <div>Сервис не найден</div>;
  return (
    <div className="lg:w-1/2 mx-auto p-8">
      <div className="w-full flex  flex-col-reverse gap-5 ">
        {role == "admin" ? (
          <FormEditService serviceId={service.id} />
        ) : (
          <div></div>
        )}

        <div className="mb-10  border overflow-hidden rounded-lg bg-white shadow-1 duration-300 hover:shadow-3 dark:bg-dark-2 dark:shadow-card dark:hover:shadow-3 max-w-[500px] w-full mx-auto">
          <img
            src={"/assets/" + service.photo}
            alt=""
            className="w-full object-cover rounded-t-lg"
          />
          <div className="p-8 text-center sm:p-9 md:p-7 xl:p-9">
            <h3 className="mb-4 block text-xl font-semibold text-dark hover:text-primary dark:text-black  sm:text-[22px] md:text-xl lg:text-[22px] xl:text-xl 2xl:text-[22px]">
              Название: {service.title}
            </h3>
            <div className="mb-7 text-base leading-relaxed text-body-color dark:text-dark-6">
              Цена: {service.price}
            </div>
            <div className="mb-7 text-base leading-relaxed text-body-color dark:text-dark-6">
              Описание: {service.description}
            </div>
            {role === "admin" && <DeleteService serviceId={service.id} />}
          </div>
        </div>
      </div>

      {email != null ? (
        <>
          <TakeOrder serviceId={params.id} />
          <TakeReview serviceId={params.id} />
        </>
      ) : (
        <div></div>
      )}

      {/* create block with tailwind for show all reviews and username who create this review */}
      <div className="flex flex-col  mb-5  mt-5">
        <h2 className="text-xl font-semibold">Отзывы:</h2>
        {reviews.map((review, i) => {
          return (
            <div key={i} className="mt-3">
              <div className="flex flex-col ">
                <div>
                  {" "}
                  <b>Клиент:</b> {review.user.username}
                </div>
                <div>
                  <b>Отзыв:</b> {review.content}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
