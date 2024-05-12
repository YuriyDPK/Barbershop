import TakeOrder from "@/components/TakeOrder";
import { db } from "@/shared/db";
import Image from "next/image";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import TakeReview from "@/components/TakeReview";
import DeleteService from "@/components/DeleteService";

export default async function Service({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { date: string; review: string };
}) {
  // получаем data пользователя
  const cookieStore = cookies();
  const role = cookieStore.get("role").value;
  const email = cookieStore.get("email").value;

  // Find the user by email to get their ID
  const user = await db.user.findUnique({ where: { email } });
  const userId = user?.id;

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
    <div className="w-1/2 mx-auto">
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
        <DeleteService serviceId={service.id} />
      </div>
      <TakeOrder serviceId={params.id} />
      <TakeReview serviceId={params.id} />
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