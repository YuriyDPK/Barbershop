// pages/masters.tsx
import React from "react";
import MasterCard from "@/components/MasterCard";

const masters = [
  {
    name: "Олег Самсонов",
    image:
      "https://i.pinimg.com/736x/a3/75/99/a37599445fa19f9b4f71f50a1962ee23.jpg",
    bio: "Олег - опытный барбер, специализирующийся на классических стрижках и бритье. Его внимание к деталям гарантирует, что каждый клиент уходит довольным своим внешним видом.",
    specialty: "Классические стрижки и бритье",
  },
  {
    name: "Петр Давидов",
    image:
      "https://i.pinimg.com/736x/0e/6d/df/0e6ddf645153087f365f8175fa5b9151.jpg",
    bio: "Петр увлечен современными прическами и тенденциями. Он всегда в курсе последних техник, чтобы предоставлять свежие и стильные образы.",
    specialty: "Современные прически",
  },
  {
    name: "Андрей Моисеев",
    image:
      "https://i.pinimg.com/564x/c9/1f/2b/c91f2b6af59025606937e60655897ed2.jpg",
    bio: "Андрей специализируется на уходе за бородой и усами, а также на креативных стрижках. Его творческий подход и профессионализм делают его одним из лучших мастеров.",
    specialty: "Уход за бородой и креативные стрижки",
  },
  // Добавьте больше мастеров по аналогии
];

const MastersPage: React.FC = () => {
  return (
    <div className="container mx-auto py-16 px-4">
      <h1 className="text-4xl font-bold text-center mb-12 text-gray-800">
        Наши мастера
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {masters.map((master, index) => (
          <MasterCard
            key={index}
            name={master.name}
            image={master.image}
            bio={master.bio}
            specialty={master.specialty}
          />
        ))}
      </div>
    </div>
  );
};

export default MastersPage;
